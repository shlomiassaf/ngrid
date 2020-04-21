import { fromEvent, timer, Observer, ReplaySubject } from 'rxjs';
import { bufferWhen, debounce, map, filter, takeUntil } from 'rxjs/operators';
import { Directive, EventEmitter, OnDestroy, ChangeDetectorRef, Injector } from '@angular/core';

import { PblNgridComponent, PblNgridPluginController, PblColumn } from '@pebula/ngrid';

import * as Events from './events';
import { matrixRowFromRow, isRowContainer, findCellRenderIndex, findParentCell } from './utils';
import { handleFocusAndSelection } from './focus-and-selection';

declare module '@pebula/ngrid/lib/grid/services/config' {
  interface PblNgridConfig {
    targetEvents?: {
      /** When set to true will enable the target events plugin on all table instances by default. */
      autoEnable?: boolean;
    };
  }
}

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    targetEvents?: PblNgridTargetEventsPlugin;
  }
  interface PblNgridPluginExtensionFactories {
    targetEvents: keyof typeof PblNgridTargetEventsPlugin;
  }
}

export const PLUGIN_KEY: 'targetEvents' = 'targetEvents';

function hasListeners(source: { observers: Observer<any>[] }): boolean {
  return source.observers.length > 0;
}

function findEventSource(source: Event): { type: 'row' | 'cell', target: HTMLElement } | undefined {
  const cellTarget = findParentCell(source.target as any);
  if (cellTarget) {
    return { type: 'cell', target: cellTarget };
  } else if (isRowContainer(source.target as any)) {
    return { type: 'cell', target: source.target as any };
  }
}

export function runOnce(): void {
  PblColumn.extendProperty('editable');
}

export class PblNgridTargetEventsPlugin<T = any> {
  rowClick = new EventEmitter<Events.PblNgridRowEvent<T>>();
  rowDblClick = new EventEmitter<Events.PblNgridRowEvent<T>>();
  rowEnter = new EventEmitter<Events.PblNgridRowEvent<T>>();
  rowLeave = new EventEmitter<Events.PblNgridRowEvent<T>>();

  cellClick = new EventEmitter<Events.PblNgridCellEvent<T, MouseEvent>>();
  cellDblClick = new EventEmitter<Events.PblNgridCellEvent<T, MouseEvent>>();
  cellEnter = new EventEmitter<Events.PblNgridCellEvent<T, MouseEvent>>();
  cellLeave = new EventEmitter<Events.PblNgridCellEvent<T, MouseEvent>>();

  mouseDown = new EventEmitter<Events.PblNgridCellEvent<T, MouseEvent> | Events.PblNgridRowEvent<T>>();
  mouseUp = new EventEmitter<Events.PblNgridCellEvent<T, MouseEvent> | Events.PblNgridRowEvent<T>>();
  keyUp = new EventEmitter<Events.PblNgridCellEvent<T, KeyboardEvent> | Events.PblNgridRowEvent<T>>();
  keyDown = new EventEmitter<Events.PblNgridCellEvent<T, KeyboardEvent> | Events.PblNgridRowEvent<T>>();

  /** @deprecated use `gird` instead */
  get table(): PblNgridComponent<any> { return this.grid; }

  protected readonly destroyed = new ReplaySubject<void>();

  private _removePlugin: (table: PblNgridComponent<any>) => void;

  constructor(public readonly grid: PblNgridComponent<any>,
              protected injector: Injector,
              protected pluginCtrl: PblNgridPluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
    if (grid.isInit) {
      this.init();
    } else {
      let subscription = pluginCtrl.events
        .subscribe( event => {
          if (event.kind === 'onInit') {
            this.init();
            subscription.unsubscribe();
            subscription = undefined;
          }
        });
    }
  }

  static create<T = any>(table: PblNgridComponent<any>, injector: Injector): PblNgridTargetEventsPlugin<T> {
    const pluginCtrl = PblNgridPluginController.find(table);
    return new PblNgridTargetEventsPlugin<T>(table, injector, pluginCtrl);
  }

  private init(): void {
    this.setupDomEvents();
    handleFocusAndSelection(this);
  }

  private setupDomEvents(): void {
    const grid = this.grid;
    const cdkTable = grid._cdkTable;
    const cdkTableElement: HTMLElement = cdkTable['_element'];

    const createCellEvent = <TEvent extends Event>(cellTarget: HTMLElement, source: TEvent): Events.PblNgridCellEvent<T, TEvent> | undefined => {
      const rowTarget = cellTarget.parentElement;
      const matrixPoint = matrixRowFromRow(rowTarget, cdkTable._rowOutlet.viewContainer);
      if (matrixPoint) {
        const event: Events.PblNgridCellEvent<T, TEvent> = { ...matrixPoint, source, cellTarget, rowTarget } as any;
        if (matrixPoint.type === 'data') {
          (event as Events.PblNgridDataMatrixPoint<T>).row = grid.ds.renderedData[matrixPoint.rowIndex];
        } else if (event.subType === 'meta') {
          // When multiple containers exists (fixed/sticky/row) the rowIndex we get is the one relative to the container..
          // We need to find the rowIndex relative to the definitions:
          const { metaRowService } = this.pluginCtrl.extApi;
          const db = event.type === 'header' ? metaRowService.header : metaRowService.footer;

          for (const coll of [db.fixed, db.row, db.sticky]) {
            const result = coll.find( item => item.el === event.rowTarget );
            if (result) {
              event.rowIndex = result.index;
              break;
            }
          }
        }

        /* `metadataFromElement()` does not provide column information nor the column itself. This will extend functionality to add the columnIndex and column.
            The simple case is when `subType === 'data'`, in this case the column is always the data column for all types (header, data and footer)

            If `subType !== 'data'` we need to get the proper column based type (type can only be `header` or `footer` at this point).
            But that's not all, because `metadataFromElement()` does not handle `meta-group` subType we need to do it here...
        */
        event.colIndex = findCellRenderIndex(cellTarget);
        if (matrixPoint.subType === 'data') {
          const column = this.grid.columnApi.findColumnAt(event.colIndex);
          const columnIndex = this.grid.columnApi.indexOf(column);
          event.column = column;
          (event as Events.PblNgridDataMatrixPoint<T>).context = this.pluginCtrl.extApi.contextApi.getCell(event.rowIndex, columnIndex);
        } else {
          const store = this.pluginCtrl.extApi.columnStore;
          const rowInfo = store.metaColumnIds[matrixPoint.type][event.rowIndex];
          const record = store.find(rowInfo.keys[event.colIndex]);
          if (rowInfo.isGroup) {
            event.subType = 'meta-group';
            event.column = matrixPoint.type === 'header' ? record.headerGroup : record.footerGroup;
          } else {
            event.column = matrixPoint.type === 'header' ? record.header : record.footer;
          }
        }
        return event;
      }
    }

    const createRowEvent = <TEvent extends Event>(rowTarget: HTMLElement, source: TEvent, root?: Events.PblNgridCellEvent<T, TEvent>): Events.PblNgridRowEvent<T> | undefined => {
      if (root) {
        const event: Events.PblNgridRowEvent<T> = {
          source,
          rowTarget,
          type: root.type,
          subType: root.subType,
          rowIndex: root.rowIndex,
          root
        } as any;
        if (root.type === 'data') {
          (event as Events.PblNgridDataMatrixRow<T>).row = root.row;
          (event as Events.PblNgridDataMatrixRow<T>).context = root.context.rowContext;
        }
        return event;
      } else {
        const matrixPoint = matrixRowFromRow(rowTarget, cdkTable._rowOutlet.viewContainer);
        if (matrixPoint) {
          const event: Events.PblNgridRowEvent<T> = { ...matrixPoint, source, rowTarget } as any;
          if (matrixPoint.type === 'data') {
            (event as Events.PblNgridDataMatrixRow<T>).context = this.pluginCtrl.extApi.contextApi.getRow(matrixPoint.rowIndex);
            (event as Events.PblNgridDataMatrixRow<T>).row = (event as Events.PblNgridDataMatrixRow<T>).context.$implicit;
          }

          /*  If `subType !== 'data'` it can only be `meta` because `metadataFromElement()` does not handle `meta-group` subType.
              We need to extend this missing part, we don't have columns here so we will try to infer it using the first column.

              It's similar to how it's handled in cell clicks, but here we don't need to extends the column info.
              We only need to change the `subType` when the row is a group row, getting a specific column is irrelevant.
              We just need A column because group columns don't mix with regular meta columns.

              NOTE: When subType is not 'data' the ype can only be `header` or `footer`.
          */
          if (matrixPoint.subType !== 'data') {
            const rowInfo = this.pluginCtrl.extApi.columnStore.metaColumnIds[matrixPoint.type][event.rowIndex];
            if (rowInfo.isGroup) {
              event.subType = 'meta-group';
            }
          }
          return event;
        }
      }
    }

    let lastCellEnterEvent: Events.PblNgridCellEvent<T, MouseEvent>;
    let lastRowEnterEvent: Events.PblNgridRowEvent<T>;
    const emitCellLeave = (source: MouseEvent): Events.PblNgridCellEvent<T> | undefined => {
      if (lastCellEnterEvent) {
        const lastCellEnterEventTemp = lastCellEnterEvent;
        this.cellLeave.emit(Object.assign({}, lastCellEnterEventTemp, { source }));
        lastCellEnterEvent = undefined;
        return lastCellEnterEventTemp;
      }
    }
    const emitRowLeave = (source: MouseEvent): Events.PblNgridRowEvent<T> | undefined => {
      if (lastRowEnterEvent) {
        const lastRowEnterEventTemp = lastRowEnterEvent;
        this.rowLeave.emit(Object.assign({}, lastRowEnterEventTemp, { source }));
        lastRowEnterEvent = undefined;
        return lastRowEnterEventTemp;
      }
    }

    const processEvent = <TEvent extends Event>(e: TEvent) => {
      const result = findEventSource(e);
      if (result) {
        if (result.type === 'cell') {
          const event = createCellEvent<TEvent>(result.target, e);
          if (event) {
            return {
              type: result.type,
              event,
              waitTime: hasListeners(this.cellDblClick) ? 250 : 1,
            };
          }
        } else if (result.type === 'row') {
          const event = createRowEvent(result.target, e);
          if (event) {
            return {
              type: result.type,
              event,
              waitTime: hasListeners(this.rowDblClick) ? 250 : 1,
            };
          }
        }
      }
    };

    /** Split the result of processEvent into cell and row events, if type is row only row event is returned, if cell then cell is returned and row is created along side. */
    const splitProcessedEvent = <TEvent extends Event>(event: ReturnType<typeof processEvent>) => {
      const cellEvent = event.type === 'cell' ? event.event as Events.PblNgridCellEvent<T, TEvent> : undefined;
      const rowEvent = cellEvent
        ? createRowEvent<TEvent>(cellEvent.rowTarget, cellEvent.source, cellEvent)
        : event.event as Events.PblNgridRowEvent<T>
      ;
      return { cellEvent, rowEvent };
    };

    const registerUpDownEvents = <TEvent extends Event>(eventName: string, emitter: EventEmitter<Events.PblNgridCellEvent<T, TEvent> | Events.PblNgridRowEvent<T>>) => {
      fromEvent(cdkTableElement, eventName)
        .pipe(
          takeUntil(this.destroyed),
          filter( source => hasListeners(emitter) ),
          map(processEvent),
          filter( result => !!result ),
        )
        .subscribe( result => {
          const { cellEvent, rowEvent } = splitProcessedEvent<TEvent>(result);
          emitter.emit(cellEvent || rowEvent);
          this.syncRow(cellEvent || rowEvent);
        });
    }

    registerUpDownEvents<MouseEvent>('mouseup', this.mouseUp);
    registerUpDownEvents<MouseEvent>('mousedown', this.mouseDown);
    registerUpDownEvents<KeyboardEvent>('keyup', this.keyUp);
    registerUpDownEvents<KeyboardEvent>('keydown', this.keyDown);

    /*
      Handling click stream for both click and double click events.
      We want to detect double clicks and clicks with minimal delays
      We check if a double click has listeners, if not we won't delay the click...
      TODO: on double click, don't wait the whole 250 ms if 2 clicks happen.
    */
    const clickStream = fromEvent(cdkTableElement, 'click').pipe(
      takeUntil(this.destroyed),
      filter( source => hasListeners(this.cellClick) || hasListeners(this.cellDblClick) || hasListeners(this.rowClick) || hasListeners(this.rowDblClick) ),
      map(processEvent),
      filter( result => !!result ),
    );

    clickStream
      .pipe(
        bufferWhen( () => clickStream.pipe( debounce( e => timer(e.waitTime) ) ) ),
        filter( events => events.length > 0 ),
      )
      .subscribe( events => {
        const event = events.shift();
        const isDoubleClick = events.length === 1; // if we have 2 events its double click, otherwise single.
        const { cellEvent, rowEvent } = splitProcessedEvent<MouseEvent>(event);
        if (isDoubleClick) {
          if (cellEvent) {
            this.cellDblClick.emit(cellEvent);
          }
          this.rowDblClick.emit(rowEvent);
        } else {
          if (cellEvent) {
            this.cellClick.emit(cellEvent);
          }
          this.rowClick.emit(rowEvent);
        }
        this.syncRow(cellEvent || rowEvent);
      });


    fromEvent(cdkTableElement, 'mouseleave')
      .pipe(
        takeUntil(this.destroyed),
      )
      .subscribe( (source: MouseEvent) => {
        let lastEvent: Events.PblNgridRowEvent<T> | Events.PblNgridCellEvent<T> = emitCellLeave(source);
        lastEvent = emitRowLeave(source) || lastEvent;
        if (lastEvent) {
          this.syncRow(lastEvent);
        }
      });

    fromEvent(cdkTableElement, 'mousemove')
      .pipe(
        takeUntil(this.destroyed),
      )
      .subscribe( (source: MouseEvent) => {
        const cellTarget: HTMLElement = findParentCell(source.target as any);
        const lastCellTarget = lastCellEnterEvent && lastCellEnterEvent.cellTarget;
        const lastRowTarget = lastRowEnterEvent && lastRowEnterEvent.rowTarget;

        let cellEvent: Events.PblNgridCellEvent<T, MouseEvent>;
        let lastEvent: Events.PblNgridRowEvent<T> | Events.PblNgridCellEvent<T>;

        if (lastCellTarget !== cellTarget) {
          lastEvent = emitCellLeave(source) || lastEvent;
        }

        if (cellTarget) {
          if (lastCellTarget !== cellTarget) {
            cellEvent = createCellEvent(cellTarget, source);
            if (cellEvent) {
              this.cellEnter.emit(lastCellEnterEvent = cellEvent);
            }
          } else {
            return;
          }
        }

        const rowTarget = (cellEvent && cellEvent.rowTarget) || (isRowContainer(source.target as any) && source.target as any);

        if (lastRowTarget !== rowTarget) {
          lastEvent = emitRowLeave(source) || lastEvent;
        }

        if (rowTarget) {
          if (lastRowTarget !== rowTarget) {
            const rowEvent = createRowEvent(rowTarget, source, cellEvent);
            if (rowEvent) {
              this.rowEnter.emit(lastRowEnterEvent = rowEvent);
            }
          }
        }

        if (lastEvent) {
          this.syncRow(lastEvent);
        }
      });
  }

  destroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this._removePlugin(this.grid);
  }

  private syncRow<TEvent extends Event>(event: Events.PblNgridRowEvent<T> | Events.PblNgridCellEvent<T, TEvent>): void {
    this.grid._cdkTable.syncRows(event.type, event.rowIndex);
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'pbl-ngrid[targetEvents], pbl-ngrid[rowClick], pbl-ngrid[rowDblClick], pbl-ngrid[rowEnter], pbl-ngrid[rowLeave], pbl-ngrid[cellClick], pbl-ngrid[cellDblClick], pbl-ngrid[cellEnter], pbl-ngrid[cellLeave], pbl-ngrid[keyDown], pbl-ngrid[keyUp]',
  // tslint:disable-next-line:use-output-property-decorator
  outputs: [ 'rowClick', 'rowDblClick', 'rowEnter', 'rowLeave', 'cellClick', 'cellDblClick', 'cellEnter', 'cellLeave', 'keyDown', 'keyUp' ]
})
export class PblNgridTargetEventsPluginDirective<T> extends PblNgridTargetEventsPlugin<T> implements OnDestroy {

  constructor(table: PblNgridComponent<any>, injector: Injector, pluginCtrl: PblNgridPluginController) {
    super(table, injector, pluginCtrl);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
