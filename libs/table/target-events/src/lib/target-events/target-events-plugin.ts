import { fromEvent } from 'rxjs';
import { Directive, EventEmitter, OnDestroy, ChangeDetectorRef, Injector } from '@angular/core';

import { NegTableComponent, NegTablePluginController, TablePlugin, KillOnDestroy } from '@neg/table';

import * as Events from './events';
import { matrixRowFromRow, isRowContainer, findCellIndex, findParentCell } from './utils';

declare module '@neg/table/lib/ext/types' {
  interface NegTablePluginExtension {
    targetEvents?: NegTableTargetEventsPlugin;
  }
  interface NegTablePluginExtensionFactories {
    targetEvents: keyof typeof NegTableTargetEventsPlugin;
  }
}

const PLUGIN_KEY: 'targetEvents' = 'targetEvents';

@TablePlugin({ id: PLUGIN_KEY, factory: 'create' })
export class NegTableTargetEventsPlugin<T = any> {
  rowClick = new EventEmitter<Events.NegTableRowEvent<T>>();
  rowEnter = new EventEmitter<Events.NegTableRowEvent<T>>();
  rowLeave = new EventEmitter<Events.NegTableRowEvent<T>>();

  cellClick = new EventEmitter<Events.NegTableCellEvent<T>>();
  cellEnter = new EventEmitter<Events.NegTableCellEvent<T>>();
  cellLeave = new EventEmitter<Events.NegTableCellEvent<T>>();

  private cdr: ChangeDetectorRef;
  private _removePlugin: (table: NegTableComponent<any>) => void;

  constructor(protected table: NegTableComponent<any>, protected injector: Injector, pluginCtrl: NegTablePluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
    this.cdr = injector.get(ChangeDetectorRef);
    if (table.isInit) {
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

  static create<T = any>(table: NegTableComponent<any>, injector: Injector): NegTableTargetEventsPlugin<T> {
    const pluginCtrl = NegTablePluginController.find(table);
    return new NegTableTargetEventsPlugin<T>(table, injector, pluginCtrl);
  }

  private init(): void {
    this.setupDomEvents();
  }

  private setupDomEvents(): void {
    const table = this.table;
    const cdkTable = table._cdkTable;
    const cdkTableElement: HTMLElement = cdkTable['_element'];

    const createCellEvent = (cellTarget: HTMLElement, source: MouseEvent): Events.NegTableCellEvent<T> | undefined => {
      const rowTarget = cellTarget.parentElement;
      const matrixPoint = matrixRowFromRow(rowTarget, cdkTable._rowOutlet.viewContainer);
      if (matrixPoint) {
        const event: Events.NegTableCellEvent<T> = { ...matrixPoint, source, cellTarget, rowTarget } as any;
        if (matrixPoint.type === 'data') {
          (event as Events.NegTableDataMatrixPoint<T>).row = table.dataSource.renderedData[matrixPoint.rowIndex];
        }

        /* `metadataFromElement()` does not provide column information nor the column itself. This will extend functionality to add the columnIndex and column.
            The simple case is when `subType === 'data'`, in this case the column is always the data column for all types (header, data and footer)

            If `subType !== 'data'` we need to get the proper column based type (type can only be `header` or `footer` at this point).
            But that's not all, because `metadataFromElement()` does not handle `meta-group` subType we need to do it here...
        */
        event.colIndex = findCellIndex(cellTarget);
        if (matrixPoint.subType === 'data') {
          event.column = table._store.find(table._store.tableRow[event.colIndex]).data;
        } else {
          const rowInfo = table._store.metaRows[matrixPoint.type][event.rowIndex];
          const record = table._store.find(rowInfo.keys[event.colIndex]);
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

    const createRowEvent = (rowTarget: HTMLElement, source: MouseEvent, root?: Events.NegTableCellEvent<T>): Events.NegTableRowEvent<T> | undefined => {
      if (root) {
        const event: Events.NegTableRowEvent<T> = {
          source,
          rowTarget,
          type: root.type,
          subType: root.subType,
          rowIndex: root.rowIndex,
          root
        } as any;
        if (root.type === 'data') {
          (event as Events.NegTableDataMatrixRow<T>).row = root.row;
        }
        return event;
      } else {
        const matrixPoint = matrixRowFromRow(rowTarget, cdkTable._rowOutlet.viewContainer);
        if (matrixPoint) {
          const event: Events.NegTableRowEvent<T> = { ...matrixPoint, source, rowTarget } as any;
          if (matrixPoint.type === 'data') {
            (event as Events.NegTableDataMatrixRow<T>).row = table.dataSource.renderedData[matrixPoint.rowIndex];
          }

          /*  If `subType !== 'data'` it can only be `meta` because `metadataFromElement()` does not handle `meta-group` subType.
              We need to extend this missing part, we don't have columns here so we will try to infer it using the first column.

              It's similar to how it's handled in cell clicks, but here we don't need to extends the column info.
              We only need to change the `subType` when the row is a group row, getting a specific column is irrelevant.
              We just need A column because group columns don't mix with regular meta columns.

              NOTE: When subType is not 'data' the ype can only be `header` or `footer`.
          */
          if (matrixPoint.subType !== 'data') {
            const rowInfo = table._store.metaRows[matrixPoint.type][event.rowIndex];
            if (rowInfo.isGroup) {
              event.subType = 'meta-group';
            }
          }
          return event;
        }
      }
    }

    let lastCellEnterEvent: Events.NegTableCellEvent<T>;
    let lastRowEnterEvent: Events.NegTableRowEvent<T>;
    const emitCellLeave = (source: MouseEvent): Events.NegTableCellEvent<T> | undefined => {
      if (lastCellEnterEvent) {
        const lastCellEnterEventTemp = lastCellEnterEvent;
        this.cellLeave.emit(Object.assign({}, lastCellEnterEventTemp, { source }));
        lastCellEnterEvent = undefined;
        return lastCellEnterEventTemp;
      }
    }
    const emitRowLeave = (source: MouseEvent): Events.NegTableRowEvent<T> | undefined => {
      if (lastRowEnterEvent) {
        const lastRowEnterEventTemp = lastRowEnterEvent;
        this.rowLeave.emit(Object.assign({}, lastRowEnterEventTemp, { source }));
        lastRowEnterEvent = undefined;
        return lastRowEnterEventTemp;
      }
    }


    fromEvent(cdkTableElement, 'click')
      .subscribe( (source: MouseEvent) => {
        const cellTarget = findParentCell(source.target as any);
        if (cellTarget) {
          const event = createCellEvent(cellTarget, source);
          if (event) {
            this.cellClick.emit(event);
            this.rowClick.emit(createRowEvent(event.rowTarget, source, event));
            this.syncRow(event);
          }
        } else if (isRowContainer(source.target as any)) {
          const event = createRowEvent(source.target as any, source);
          this.rowClick.emit(event);
          this.syncRow(event);
        }
      });


    fromEvent(cdkTableElement, 'mouseleave')
      .subscribe( (source: MouseEvent) => {
        let lastEvent: Events.NegTableRowEvent<T> | Events.NegTableCellEvent<T> = emitCellLeave(source);
        lastEvent = emitRowLeave(source) || lastEvent;
        lastEvent && this.syncRow(lastEvent);
      });

    fromEvent(cdkTableElement, 'mousemove')
      .subscribe( (source: MouseEvent) => {
        const cellTarget: HTMLElement = findParentCell(source.target as any);
        const lastCellTarget = lastCellEnterEvent && lastCellEnterEvent.cellTarget;
        const lastRowTarget = lastRowEnterEvent && lastRowEnterEvent.rowTarget;

        let cellEvent: Events.NegTableCellEvent<T>;
        let lastEvent: Events.NegTableRowEvent<T> | Events.NegTableCellEvent<T>;

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

        lastEvent && this.syncRow(lastEvent);
      });
  }

  destroy(): void {
    this._removePlugin(this.table);
  }

  private syncRow(event: Events.NegTableRowEvent<T> | Events.NegTableCellEvent<T>): void {
    this.table._cdkTable.syncRows(event.type, event.rowIndex);
  }
}

@Directive({
  selector: 'neg-table[rowClick], neg-table[rowEnter], neg-table[rowLeave], neg-table[cellClick], neg-table[cellEnter], neg-table[cellLeave]',
  outputs: [ 'rowClick', 'rowEnter', 'rowLeave', 'cellClick', 'cellEnter', 'cellLeave' ]
})
@KillOnDestroy()
export class NegTableTargetEventsPluginDirective<T> extends NegTableTargetEventsPlugin<T> implements OnDestroy {

  constructor(table: NegTableComponent<any>, injector: Injector, pluginCtrl: NegTablePluginController) {
    super(table, injector, pluginCtrl);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
