import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  SkipSelf
} from '@angular/core';

import { Directionality, Direction } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DragDrop,
  CdkDropList,
  CdkDropListGroup,
  CdkDrag,
  CDK_DROP_LIST,
  CdkDragDrop, CdkDragStart, CDK_DRAG_PARENT, DragDropConfig, CDK_DRAG_CONFIG, CDK_DRAG_HANDLE, CdkDragHandle
} from '@angular/cdk/drag-drop';

import { PblNgridComponent, PblNgridPluginController, PblNgridCellContext } from '@pebula/ngrid';
import { CdkLazyDropList, CdkLazyDrag } from '../core/lazy-drag-drop';
import { PblDropListRef } from '../core/drop-list-ref';
import { PblDragRef } from '../core/drag-ref';
import { PblDragDrop } from '../core/drag-drop';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    rowReorder?: PblNgridRowReorderPluginDirective;
  }
}

export const ROW_REORDER_PLUGIN_KEY: 'rowReorder' = 'rowReorder';

let _uniqueIdCounter = 0;

@Directive({
  selector: 'pbl-ngrid[rowReorder]',
  exportAs: 'pblNgridRowReorder',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
    '[class.pbl-row-reorder]': 'rowReorder && !this.grid.ds?.sort.sort?.order && !this.grid.ds?.filter?.filter'
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CdkDropListGroup, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridRowReorderPluginDirective }
  ]
})
export class PblNgridRowReorderPluginDirective<T = any> extends CdkDropList<T> implements OnDestroy, CdkLazyDropList<T, PblNgridRowReorderPluginDirective<T>> {

  id = `pbl-ngrid-row-reorder-list-${_uniqueIdCounter++}`;

  @Input() get rowReorder(): boolean { return this._rowReorder; };
  set rowReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._rowReorder = value;
  }

  private _rowReorder = false;
  private _removePlugin: (grid: PblNgridComponent<any>) => void;

  constructor(public grid: PblNgridComponent<T>,
              pluginCtrl: PblNgridPluginController,
              element: ElementRef<HTMLElement>,
              dragDrop: DragDrop,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() dir?: Directionality,
              @Optional() @SkipSelf() group?: CdkDropListGroup<CdkDropList>) {
    super(element, dragDrop, changeDetectorRef, dir, group);
    this._removePlugin = pluginCtrl.setPlugin(ROW_REORDER_PLUGIN_KEY, this);

    this.dropped.subscribe((event: CdkDragDrop<T>) => {
      const item = event.item as PblNgridRowDragDirective<T>;

      const previousIndex = grid.ds.source.indexOf(item.draggedContext.row);
      const currentIndex = event.currentIndex + grid.ds.renderStart;

      this.grid.contextApi.clear();
      this.grid.ds.moveItem(previousIndex, currentIndex, true);
      this.grid._cdkTable.syncRows('data');
    });
  }

  /* CdkLazyDropList start */
  /**
   * Selector that will be used to determine the direct container element, starting from
   * the `cdkDropList` element and going down the DOM. Passing an alternate direct container element
   * is useful when the `cdkDropList` is not the direct parent (i.e. ancestor but not father)
   * of the draggable elements.
   */
   // tslint:disable-next-line:no-input-rename
  @Input('cdkDropListDirectContainerElement') directContainerElement: string = '.pbl-ngrid-scroll-container'; // we need this to allow auto-scroll

  get pblDropListRef(): PblDropListRef<any> { return this._dropListRef as any; }
  get dir(): Direction { return this.grid.dir; }
  originalElement: ElementRef<HTMLElement>;
  ngOnInit(): void { CdkLazyDropList.prototype.ngOnInit.call(this); }
  addDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.addDrag.call(this, drag); }
  removeDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.removeDrag.call(this, drag); }
  beforeStarted(): void { CdkLazyDropList.prototype.beforeStarted.call(this); }
  /* CdkLazyDropList end */

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removePlugin(this.grid);
  }
}

@Directive({
  selector: '[pblNgridRowDrag]',
  exportAs: 'pblNgridRowDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()'
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DRAG_PARENT, useExisting: PblNgridRowDragDirective }
  ]
})
export class PblNgridRowDragDirective<T = any> extends CdkDrag<T> implements CdkLazyDrag<T, PblNgridRowReorderPluginDirective<T>> {
  rootElementSelector = 'pbl-ngrid-row';

  get context(): Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>> {
    return this._context;
  }

  @Input('pblNgridRowDrag') set context(value: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>) {
    this._context = value;

    const pluginCtrl = this.pluginCtrl = value && PblNgridPluginController.find(value.grid);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(ROW_REORDER_PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
  }

  /**
   * Reference to the last dragged context.
   *
   * This context is not similar to the `context` property.
   * The `context` property holds the current context which is shared and updated on scroll so if a user start a drag and then scrolled
   * the context will point to the row in view and not the original cell.
   */
  get draggedContext(): Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>> {
    return this._draggedContext;
  }

  private _context: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>;
  private _draggedContext: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>;

  private pluginCtrl: PblNgridPluginController;

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

  get pblDragRef(): PblDragRef<any> { return this._dragRef as any; }
  get dir(): Direction { return this.pluginCtrl.extApi.grid.dir };

  @Input() get cdkDropList(): PblNgridRowReorderPluginDirective<T> { return this.dropContainer as PblNgridRowReorderPluginDirective<T>; }
  set cdkDropList(value: PblNgridRowReorderPluginDirective<T>) {
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
  ngOnInit(): void {
    this.started.subscribe((event: CdkDragStart) => {
      const { col, row, grid, value } = this._context;
      this._draggedContext = { col, row, grid, value };
    });
    CdkLazyDrag.prototype.ngOnInit.call(this);
  }
  ngAfterViewInit(): void { CdkLazyDrag.prototype.ngAfterViewInit.call(this); super.ngAfterViewInit(); }
  ngOnDestroy(): void { CdkLazyDrag.prototype.ngOnDestroy.call(this);  super.ngOnDestroy(); }
  /* CdkLazyDrag end */
}
