// tslint:disable:no-output-rename
import { BehaviorSubject } from 'rxjs';
import { Directive, Input, Output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DragDrop,
  CdkDragDrop,
  CDK_DROP_LIST,
  DragRef,
  CdkDropList,
  CDK_DRAG_PARENT
} from '@angular/cdk/drag-drop';

import { PblNgridComponent, PblColumn, PblNgridPluginController, PblNgridCellContext } from '@pebula/ngrid';
import { PblDragDrop, CdkLazyDropList, CdkLazyDrag } from '../core/index';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    columnReorder?: PblNgridColumnReorderPluginDirective;
  }
}

export const COL_REORDER_PLUGIN_KEY: 'columnReorder' = 'columnReorder';

let _uniqueIdCounter = 0;

@Directive({
  selector: 'pbl-ngrid[columnReorder]',
  exportAs: 'pblNgridColumnReorder',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST, useExisting: PblNgridColumnReorderPluginDirective },
  ],
})
export class PblNgridColumnReorderPluginDirective<T = any> extends CdkLazyDropList<T, PblNgridColumnReorderPluginDirective<T>> {
  id = `pbl-ngrid-column-reorder-list-${_uniqueIdCounter++}`;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Input() get columnReorder(): boolean { return this._columnReorder; };
  set columnReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._columnReorder = value;
  }

  /**
   * When true, will not move the column on drop.
   * Instead you need to handle the dropped event.
   */
  @Input() get manualOverride(): boolean { return this._manualOverride; };
  set manualOverride(value: boolean) { this._manualOverride = coerceBooleanProperty(value); }

  @Output('cdkDropDragging') dragging: BehaviorSubject<boolean>;

  private _columnReorder = false;
  private _manualOverride = false;
  private _removePlugin: (table: PblNgridComponent<any>) => void;
  private lastSwap: DragRef<PblNgridColumnDragDirective<T>>;
  private lastSorted: { drag: DragRef<PblNgridColumnDragDirective<T>>; offset: number; clientRect: ClientRect; };

  // Stuff to workaround encapsulation in CdkDropList
  private get pblGetItemIndexFromPointerPosition(): (item: DragRef<PblNgridColumnDragDirective<T>>, pointerX: number, pointerY: number, delta?: {x: number, y: number}) => number {
    return (this._dropListRef as any)._getItemIndexFromPointerPosition.bind(this._dropListRef);
  }
  private get pblGetPositionCacheItems(): { drag: DragRef<PblNgridColumnDragDirective<T>>; offset: number; clientRect: ClientRect; }[] {
    return (this._dropListRef as any)._itemPositions;
  }

  private connections = new Set<CdkDropList>();

  connectTo(dropList: CdkDropList) {
    if (!this.connections.has(dropList)) {
      this.connections.add(dropList);
      this.connectedTo = Array.from(this.connections);
    }
  }

  disconnectFrom(dropList: CdkDropList) {
    if (this.connections.delete(dropList)) {
      this.connectedTo = Array.from(this.connections);
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dropped.subscribe( e => this._pblReset() );
    this.pblDropListRef.beforeExit.subscribe( e => this._pblReset() );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removePlugin(this.grid);
  }

  protected beforeStarted(): void {
    super.beforeStarted();
    this.lastSorted = undefined;
    this.dragging.next(true);
  }

  private _pblReset(): void {
    this.dragging.next(false);
    const siblings = this.pblGetPositionCacheItems;
    siblings.forEach((sibling, index) => {
      for (const c of sibling.drag.data.getCells()) {
        c.style.transform = ``;
      }
    });
  }

  protected gridChanged() {
    this.dragging = new BehaviorSubject<boolean>(false);
    this._removePlugin = this.gridApi.pluginCtrl.setPlugin(COL_REORDER_PLUGIN_KEY, this);

    this.directContainerElement = '.pbl-ngrid-header-row-main';
    this.dropped.subscribe( (event: CdkDragDrop<T, any>) => {
      if (!this.manualOverride) {
        this.grid.columnApi.moveColumn((event.item as PblNgridColumnDragDirective<T>).column, event.currentIndex);
      }
    });

    this.dragging.subscribe( isDragging => {
      const el = this.originalElement.nativeElement;
      if (isDragging) {
        el.classList.add('pbl-ngrid-column-list-dragging');
      } else {
        el.classList.remove('pbl-ngrid-column-list-dragging');
      }
      this.lastSwap = undefined;
    });

    this.monkeyPatchDropListRef();
  }

  private monkeyPatchDropListRef(): void {
    const { _sortItem, enter } = this._dropListRef;

    this.pblDropListRef.enter = (item: Parameters<typeof enter>[0], pointerX: number, pointerY: number): void => {
      const lastSorted = this.lastSorted
      this.lastSorted = undefined;
      if (lastSorted && lastSorted.drag === item) {
        const isHorizontal = this.orientation === 'horizontal';
        pointerX = lastSorted.clientRect.left + 1 - (isHorizontal ? lastSorted.offset : 0);
        pointerY = lastSorted.clientRect.top + 1 - (!isHorizontal ? lastSorted.offset : 0);
      }
      enter.call(this._dropListRef, item, pointerX, pointerY);
    };

    this.pblDropListRef._sortItem = (item: Parameters<typeof enter>[0], pointerX: number, pointerY: number, pointerDelta: {x: number, y: number}): void => {
      const siblings = this.pblGetPositionCacheItems;
      this.lastSorted = siblings.find( s => s.drag === item );
      const newIndex = this.pblGetItemIndexFromPointerPosition(item as DragRef<PblNgridColumnDragDirective<T>>, pointerX, pointerY, pointerDelta);
      if (newIndex === -1 && siblings.length > 0) {
        return;
      }
      const oldOrder = siblings.slice();
      const isHorizontal = this.orientation === 'horizontal';
      const siblingAtNewPosition = siblings[newIndex];

      if (siblingAtNewPosition.drag.data.column.wontBudge) {
        return;
      }

      // we now need to find if between current and new position there are items with `wontBudge`
      const itemAtOriginalPosition = this.lastSwap ? this.lastSwap : item;
      const currentIndex = siblings.findIndex( currentItem => currentItem.drag === itemAtOriginalPosition );
      const start = Math.min(newIndex, currentIndex)
      const itemsDraggedOver = siblings.slice(start, Math.abs(newIndex - currentIndex) + start);
      for (const dragItem of itemsDraggedOver) {
        if (dragItem.drag.data.column.wontBudge && dragItem.drag !== item) {
          return;
        }
      }

      // check if we move the item outside of locked group OR into a locked group... both are invalid.
      if (!item.data.column.checkGroupLockConstraint(siblingAtNewPosition.drag.data.column)) {
        return;
      }

      _sortItem.call(this._dropListRef, item, pointerX, pointerY, pointerDelta);

      this.lastSwap = siblingAtNewPosition.drag;

      if (isHorizontal) {
        siblings.forEach((sibling, index) => {
          // Don't do anything if the position hasn't changed.
          if (oldOrder[index] === sibling) {
            return;
          }

          for (const c of sibling.drag.data.getCells()) {
            c.style.transform = `translate3d(${sibling.offset}px, 0, 0)`;
          }
        });
      }
    };
  }
}

@Directive({
  selector: '[pblNgridColumnDrag]',
  exportAs: 'pblNgridColumnDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DRAG_PARENT, useExisting: PblNgridColumnDragDirective }
  ]
})
export class PblNgridColumnDragDirective<T = any> extends CdkLazyDrag<T, PblNgridColumnReorderPluginDirective<T>, PblNgridColumnDragDirective<T>> {
  rootElementSelector = 'pbl-ngrid-header-cell';

  column: PblColumn;

  @Input('pblNgridColumnDrag') set context(value: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>) {
    this._context = value;
    this.column = value && value.col;
    const pluginCtrl = this.pluginCtrl = value && PblNgridPluginController.find(value.grid);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(COL_REORDER_PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
    this.disabled = this.column && this.column.reorder ? false : true;
  }

  private _context: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>
  private pluginCtrl: PblNgridPluginController;
  private cache: HTMLElement[];

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this._dragRef.beforeStarted.subscribe( () => {
      const { cdkDropList } = this;
      if (cdkDropList && cdkDropList.columnReorder && this._context.col.reorder) {
        // we don't allow a new dragging session before the previous ends.
        // this sound impossible, but due to animation transitions its actually is.
        // if the `transitionend` is long enough, a new drag can start...
        //
        // the `disabled` state is checked by pointerDown AFTER calling before start so we can cancel the start...
        if (cdkDropList._dropListRef.isDragging()) {
          return this.disabled = true;
        }
      }
    });
    this.started.subscribe( () => this._context.col.columnDef.isDragging = true );
    this.ended.subscribe( () => this._context.col.columnDef.isDragging = false );
  }

  getCells(): HTMLElement[] {
    if (!this.cache) {
      this.cache = this._context.col.columnDef.queryCellElements('table');
    }
    return this.cache;
  }

  reset(): void {
    super.reset();
    if (this.cache) {
      for (const el of this.cache) {
        el.style.transform = ``;
      }
      this.cache = undefined;
    }
  }
}
