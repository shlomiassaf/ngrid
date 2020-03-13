// tslint:disable:no-output-rename
import { BehaviorSubject } from 'rxjs';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  Inject,
  SkipSelf,
  Output,
  OnDestroy,
  Optional,
  OnInit,
  ViewContainerRef,
  NgZone,
  QueryList,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DragDrop,
  CdkDrag,
  CdkDragDrop,
  CDK_DROP_LIST,
  DragRef,
  CdkDropListGroup,
  CdkDropList,
  CDK_DRAG_CONFIG,
  DragRefConfig,
} from '@angular/cdk/drag-drop';

import { PblNgridComponent, NgridPlugin, PblColumn, PblNgridPluginController, PblNgridCellContext } from '@pebula/ngrid';
import { PblDragDrop } from '../core/drag-drop';
import { CdkLazyDropList, CdkLazyDrag } from '../core/lazy-drag-drop';
import { PblDropListRef } from '../core/drop-list-ref';
import { PblDragRef } from '../core/drag-ref';
import { extendGrid } from './extend-grid';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    columnReorder?: PblNgridColumnReorderPluginDirective;
  }
}

export const PLUGIN_KEY: 'columnReorder' = 'columnReorder';

let _uniqueIdCounter = 0;

@NgridPlugin({ id: PLUGIN_KEY, runOnce: extendGrid })
@Directive({
  selector: 'pbl-ngrid[columnReorder]',
  exportAs: 'pblNgridColumnReorder',
  inputs: [
    'directContainerElement:cdkDropListDirectContainerElement'
  ],
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
export class PblNgridColumnReorderPluginDirective<T = any> extends CdkDropList<T> implements OnInit, OnDestroy, CdkLazyDropList<T, PblNgridColumnReorderPluginDirective<T>> {
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

  @Output('cdkDropDragging') dragging: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  _draggables: QueryList<CdkDrag>;

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

  constructor(public table: PblNgridComponent<T>,
              pluginCtrl: PblNgridPluginController,
              element: ElementRef<HTMLElement>,
              dragDrop: DragDrop,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() dir?: Directionality,
              @Optional() @SkipSelf() group?: CdkDropListGroup<CdkDropList>) {
    super(element, dragDrop, changeDetectorRef, dir, group);
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    this.directContainerElement = '.pbl-ngrid-header-row-main';
    this.dropped.subscribe( (event: CdkDragDrop<T, any>) => {
      if (!this.manualOverride) {
        this.table.columnApi.moveColumn((event.item as PblNgridColumnDragDirective<T>).column, event.currentIndex);
      }
    });

    this.dragging.subscribe( isDragging => {
      const el = element.nativeElement;
      if (isDragging) {
        el.classList.add('pbl-ngrid-column-list-dragging');
      } else {
        el.classList.remove('pbl-ngrid-column-list-dragging');
      }
      this.lastSwap = undefined;
    });

    this.monkeyPatchDropListRef();
  }

  /* CdkLazyDropList start */
  /**
   * Selector that will be used to determine the direct container element, starting from
   * the `cdkDropList` element and going down the DOM. Passing an alternate direct container element
   * is useful when the `cdkDropList` is not the direct parent (i.e. ancestor but not father)
   * of the draggable elements.
   */
  directContainerElement: string;
  get pblDropListRef(): PblDropListRef<PblNgridColumnReorderPluginDirective<T>> { return this._dropListRef as any; }
  originalElement: ElementRef<HTMLElement>;
  _draggablesSet = new Set<CdkDrag>();
  // ngOnInit(): void { CdkLazyDropList.prototype.ngOnInit.call(this); }
  addDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.addDrag.call(this, drag); }
  removeDrag(drag: CdkDrag): boolean { return CdkLazyDropList.prototype.removeDrag.call(this, drag); }
  // beforeStarted(): void { CdkLazyDropList.prototype.beforeStarted.call(this); }
  /* CdkLazyDropList end */

  ngOnInit(): void {
    CdkLazyDropList.prototype.ngOnInit.call(this); // super.ngOnInit();
    this.dropped.subscribe( e => this._pblReset() );
    this.pblDropListRef.beforeExit.subscribe( e => this._pblReset() );
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removePlugin(this.table);
  }

  /* protected */ beforeStarted(): void {
    CdkLazyDropList.prototype.beforeStarted.call(this); // super.beforeStarted();
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
    { provide: CdkDrag, useExisting: PblNgridColumnDragDirective }
  ]
})
export class PblNgridColumnDragDirective<T = any> extends CdkDrag<T> implements AfterViewInit, CdkLazyDrag<T, PblNgridColumnReorderPluginDirective<T>, PblNgridColumnDragDirective<T>> {
  rootElementSelector = 'pbl-ngrid-header-cell';

  column: PblColumn;

  @Input('pblNgridColumnDrag') set context(value: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>) {
    this._context = value;
    this.column = value && value.col;
    const pluginCtrl = this.pluginCtrl = value && PblNgridPluginController.find(value.grid);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
    this.disabled = this.column && this.column.reorder ? false : true;
  }

  private _context: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>
  private pluginCtrl: PblNgridPluginController;
  private cache: HTMLElement[];

  // CTOR IS REQUIRED OR IT WONT WORK IN AOT
  // TODO: Try to remove when supporting IVY
  constructor(element: ElementRef<HTMLElement>,
              @Inject(CDK_DROP_LIST) @Optional() @SkipSelf() dropContainer: CdkDropList,
              @Inject(DOCUMENT) _document: any,
              _ngZone: NgZone,
              _viewContainerRef: ViewContainerRef,
              @Inject(CDK_DRAG_CONFIG) config: DragRefConfig,
              _dir: Directionality,
              dragDrop: DragDrop,
              _changeDetectorRef: ChangeDetectorRef) {
    super(
      element,
      dropContainer,
      _document,
      _ngZone,
      _viewContainerRef,
      config,
      _dir,
      dragDrop,
      _changeDetectorRef,
    );
  }

  /* CdkLazyDrag start */
  /**
   * A class to set when the root element is not the host element. (i.e. when `cdkDragRootElement` is used).
   */
  @Input('cdkDragRootElementClass') set rootElementSelectorClass(value: string) { // tslint:disable-line:no-input-rename
    if (value !== this._rootClass && this._hostNotRoot) {
      if (this._rootClass) {
        this.getRootElement().classList.remove(...this._rootClass.split(' '));
      }
      if (value) {
        this.getRootElement().classList.add(...value.split(' '));
      }
    }
    this._rootClass = value;
  }

  get pblDragRef(): PblDragRef<PblNgridColumnDragDirective<T>> { return this._dragRef as any; }

  @Input() get cdkDropList(): PblNgridColumnReorderPluginDirective<T> { return this.dropContainer as PblNgridColumnReorderPluginDirective<T>; }
  set cdkDropList(value: PblNgridColumnReorderPluginDirective<T>) {
    // TO SUPPORT `cdkDropList` via string input (ID) we need a reactive registry...
    if (this.cdkDropList) {
      this.cdkDropList.removeDrag(this);
    }
    this.dropContainer = value;
    if (value) {
      this._dragRef._withDropContainer(value._dropListRef);
      value.addDrag(this);
    }
  }

  _rootClass: string;
  _hostNotRoot = false;
  ngOnInit(): void { CdkLazyDrag.prototype.ngOnInit.call(this); }
  // ngAfterViewInit(): void { CdkLazyDrag.prototype.ngAfterViewInit.call(this); super.ngAfterViewInit(); }
  ngOnDestroy(): void { CdkLazyDrag.prototype.ngOnDestroy.call(this);  super.ngOnDestroy(); }
  /* CdkLazyDrag end */

  ngAfterViewInit(): void {
    CdkLazyDrag.prototype.ngAfterViewInit.call(this);
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
