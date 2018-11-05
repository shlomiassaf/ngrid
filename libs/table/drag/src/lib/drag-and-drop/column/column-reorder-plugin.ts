  // tslint:disable:no-output-rename

import { BehaviorSubject } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  Output,
  OnDestroy,
  Optional,
} from '@angular/core';

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  CdkDropList,
  DragDropRegistry,
  CdkDrag,
  CdkDragDrop,
  CDK_DROP_LIST_CONTAINER,
} from '@angular/cdk/drag-drop';

import { NegTableComponent, TablePlugin, NegColumn, NegColumnGroup, NegTablePluginController, NegTableCellContext } from '@neg/table';
import { CdkLazyDropList, CdkLazyDrag } from '../lazy-drag-drop';


import './extend-table';
declare module '@neg/table/lib/ext/types' {
  interface NegTablePluginExtension {
    columnReorder?: NegTableColumnReorderPluginDirective;
  }
}

const PLUGIN_KEY: 'columnReorder' = 'columnReorder';

let _uniqueIdCounter = 0;

@TablePlugin({ id: PLUGIN_KEY })
@Directive({
  selector: 'neg-table[columnReorder]',
  exportAs: 'negTableColumnReorder',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
  },
  providers: [
    { provide: CDK_DROP_LIST_CONTAINER, useExisting: NegTableColumnReorderPluginDirective },
  ],
})
export class NegTableColumnReorderPluginDirective<T = any> extends CdkLazyDropList<T> implements OnDestroy {
  id = `neg-table-column-reorder-list-${_uniqueIdCounter++}`;
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

  @Output('cdkDropDragging') dragging: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _columnReorder = false;
  private _manualOverride = false;
  private _removePlugin: (table: NegTableComponent<any>) => void;
  private lastSwap: NegTableColumnDragDirective;
  private lastExit: { position: number, item: { drag: NegTableColumnDragDirective; offset: number; clientRect: ClientRect; } };

  // Stuff to workaround encapsulation in CdkDropList
  private negGetItemIndexFromPointerPosition: (item: CdkDrag, pointerX: number, pointerY: number, delta?: {x: number, y: number}) => number = (this as any)._getItemIndexFromPointerPosition;
  private get negGetPositionCacheItems(): { drag: NegTableColumnDragDirective; offset: number; clientRect: ClientRect; }[] { return (this as any)._positionCache.items; }

  constructor(public table: NegTableComponent<T>,
              pluginCtrl: NegTablePluginController,
              element: ElementRef<HTMLElement>,
              dragDropRegistry: DragDropRegistry<CdkDrag, CdkDropList<T>>,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() private dir?: Directionality) {
    super(element, dragDropRegistry, changeDetectorRef, dir);
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    this.directContainerElement = '.neg-table-header-row-main';
    this.dropped.subscribe( (event: CdkDragDrop<T, any>) => {
      if (!this.manualOverride) {
        this.table.columnApi.moveColumn((event.item as NegTableColumnDragDirective<T>).column, event.currentIndex);
      }
    });

    this.dragging.subscribe( isDragging => {
      if (!table._cdkTable) { return; }

      if (isDragging) {
        table._cdkTable.addClass('neg-table-column-list-dragging');
      } else {
        table._cdkTable.removeClass('neg-table-column-list-dragging');
      }
      this.lastSwap = undefined;
    });
  }

  start(): void {
    this.lastExit = undefined;
    this.dragging.next(true);
    super.start();
  }

  drop(item: NegTableColumnDragDirective, currentIndex: number, previousContainer: CdkDropList): void {
    this._negReset();
    super.drop(item, currentIndex, previousContainer);
  }

  enter(item: NegTableColumnDragDirective, pointerX: number, pointerY: number): void {
    if (this.lastExit) {
      const lastExit = this.lastExit;
      this.lastExit = undefined;
      if (lastExit.item.drag === item) {
        const isHorizontal = this.orientation === 'horizontal';
        pointerX = lastExit.item.clientRect.left + 1 - (isHorizontal ? lastExit.item.offset : 0);
        pointerY = lastExit.item.clientRect.top + 1 - (!isHorizontal ? lastExit.item.offset : 0);
      }
    }
    super.enter(item, pointerX, pointerY);
  }

  exit(item: NegTableColumnDragDirective): void {
    const position = this.negGetPositionCacheItems.findIndex( currentItem => currentItem.drag === item );
    this.lastExit = { position, item: this.negGetPositionCacheItems[position] };
    this._negReset()
    super.exit(item);
  }

  _sortItem(item: NegTableColumnDragDirective, pointerX: number, pointerY: number, pointerDelta: {x: number, y: number}): void {
    const siblings = this.negGetPositionCacheItems;
    const oldOrder = siblings.slice();

    const newIndex = this.negGetItemIndexFromPointerPosition(item, pointerX, pointerY, pointerDelta);
    if (newIndex === -1 && siblings.length > 0) {
      return;
    }

    const isHorizontal = this.orientation === 'horizontal';
    const siblingAtNewPosition = siblings[newIndex];

    if (siblingAtNewPosition.drag.column.wontBudge) {
      return;
    }

    // we now need to find if between current and new position there are items with `wontBudge`
    const itemAtOriginalPosition = this.lastSwap ? this.lastSwap : item;
    const currentIndex = siblings.findIndex( currentItem => currentItem.drag === itemAtOriginalPosition );
    const start = Math.min(newIndex, currentIndex)
    const itemsDraggedOver = siblings.slice(start, Math.abs(newIndex - currentIndex) + start);
    for (const dragItem of itemsDraggedOver) {
      if (dragItem.drag.column.wontBudge && dragItem.drag !== item) {
        return;
      }
    }

    // check if we move the item outside of locked group OR into a locked group... both are invalid.
    if (!item.column.checkGroupLockConstraint(siblingAtNewPosition.drag.column)) {
      return;
    }

    super._sortItem(item, pointerX, pointerY, pointerDelta);

    this.lastSwap = siblingAtNewPosition.drag;

    if (isHorizontal) {
      siblings.forEach((sibling, index) => {
        // Don't do anything if the position hasn't changed.
        if (oldOrder[index] === sibling) {
          return;
        }

        for (const c of sibling.drag.getCells()) {
          c.style.transform = `translate3d(${sibling.offset}px, 0, 0)`;
        }
      });
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removePlugin(this.table);
  }

  private _negReset(): void {
    this.dragging.next(false);
    const siblings = this.negGetPositionCacheItems;
    siblings.forEach((sibling, index) => {
      for (const c of sibling.drag.getCells()) {
        c.style.transform = ``;
      }
    });
  }
}

@Directive({
  selector: '[negTableColumnDrag]',
  exportAs: 'negTableColumnDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_hasStartedDragging && _isDragging()',
  },
  providers: [
    { provide: CdkDrag, useExisting: NegTableColumnDragDirective }
  ]
})
export class NegTableColumnDragDirective<T = any> extends CdkLazyDrag<T, NegTableColumnReorderPluginDirective<T>> implements AfterViewInit {
  rootElementSelector = 'neg-table-header-cell';

  column: NegColumn;

  @Input('negTableColumnDrag') set context(value: Pick<NegTableCellContext<T>, 'col' | 'table'> & Partial<Pick<NegTableCellContext<T>, 'row' | 'value'>>) {
    this._context = value;
    this.column = value && value.col;
    const pluginCtrl = this.pluginCtrl = value && NegTablePluginController.find(value.table);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
  }

  private _context: Pick<NegTableCellContext<T>, 'col' | 'table'> & Partial<Pick<NegTableCellContext<T>, 'row' | 'value'>>
  private pluginCtrl: NegTablePluginController;
  private cache: HTMLElement[];

  ngAfterViewInit(): void {
    const _pointerDown = this._pointerDown;
    this._pointerDown = (event: MouseEvent | TouchEvent) => {
      const { cdkDropList } = this;
      if (cdkDropList && cdkDropList.columnReorder && this._context.col.reorder) {
        // we don't allow a new dragging session before the previous ends.
        // this sound impossible, but due to animation transitions its actually is.
        // if the `transitionend` is long enough, a new drag can start...
        if (!cdkDropList._dragging) {
          _pointerDown(event);
        }
      }
    }

    super.ngAfterViewInit();
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
