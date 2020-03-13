import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  Inject,
  OnDestroy,
  Optional,
  SkipSelf,
  ViewContainerRef,
  NgZone,
  QueryList,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DragDrop,
  CdkDropList,
  CdkDropListGroup,
  CdkDrag,
  CDK_DROP_LIST,
  CDK_DRAG_CONFIG, DragRefConfig, CdkDragDrop, CdkDragStart
} from '@angular/cdk/drag-drop';

import { PblNgridComponent, NgridPlugin, PblNgridPluginController, PblNgridCellContext } from '@pebula/ngrid';
import { CdkLazyDropList, CdkLazyDrag } from '../core/lazy-drag-drop';
import { PblDropListRef } from '../core/drop-list-ref';
import { PblDragRef } from '../core/drag-ref';
import { PblDragDrop } from '../core/drag-drop';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    rowReorder?: PblNgridRowReorderPluginDirective;
  }
}

const PLUGIN_KEY: 'rowReorder' = 'rowReorder';

let _uniqueIdCounter = 0;

@NgridPlugin({ id: PLUGIN_KEY })
@Directive({
  selector: 'pbl-ngrid[rowReorder]',
  exportAs: 'pblNgridRowReorder',
  inputs: [
    'directContainerElement:cdkDropListDirectContainerElement'
  ],
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
    '[class.pbl-row-reorder]': 'rowReorder && !this.grid.ds?.sort.sort?.order && !this.grid.ds?.filter?.filter',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CdkDropListGroup, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridRowReorderPluginDirective },
  ],
})
export class PblNgridRowReorderPluginDirective<T = any> extends CdkDropList<T> implements OnDestroy, CdkLazyDropList<T, PblNgridRowReorderPluginDirective<T>> {

  id = `pbl-ngrid-row-reorder-list-${_uniqueIdCounter++}`;

  @Input() get rowReorder(): boolean { return this._rowReorder; };
  set rowReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._rowReorder = value;
  }

  _draggables: QueryList<CdkDrag>;

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
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    this.dropped.subscribe( (event: CdkDragDrop<T>) => {
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
  directContainerElement: string = '.pbl-ngrid-scroll-container'; // we need this to allow auto-scroll
  get pblDropListRef(): PblDropListRef<any> { return this._dropListRef as any; }
  originalElement: ElementRef<HTMLElement>;
  _draggablesSet = new Set<CdkDrag>();
  ngOnInit(): void { CdkLazyDropList.prototype.ngOnInit.call(this); }
  addDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.addDrag.call(this, drag); }
  removeDrag(drag: CdkDrag): boolean { return CdkLazyDropList.prototype.removeDrag.call(this, drag); }
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
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CdkDrag, useExisting: PblNgridRowDragDirective }
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
    const plugin = pluginCtrl && pluginCtrl.getPlugin(PLUGIN_KEY);
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

    this.started.subscribe( (event: CdkDragStart) => {
      const { col, row, grid, value }  = this._context;
      this._draggedContext = { col, row, grid, value };
    });


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

  get pblDragRef(): PblDragRef<any> { return this._dragRef as any; }

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
  ngOnInit(): void { CdkLazyDrag.prototype.ngOnInit.call(this); }
  ngAfterViewInit(): void { CdkLazyDrag.prototype.ngAfterViewInit.call(this); super.ngAfterViewInit(); }
  ngOnDestroy(): void { CdkLazyDrag.prototype.ngOnDestroy.call(this);  super.ngOnDestroy(); }
  /* CdkLazyDrag end */
}
