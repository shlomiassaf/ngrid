import {
  Input,
  Directive,
  ElementRef,
  Optional,
  OnInit,
  Inject,
  SkipSelf,
  ChangeDetectorRef
} from '@angular/core';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  DragDrop,
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CDK_DROP_LIST,
  CDK_DROP_LIST_GROUP,
  CDK_DRAG_CONFIG,
  DragDropConfig,
} from '@angular/cdk/drag-drop';
import { PblNgridComponent, PblNgridExtensionApi, PblNgridPluginController } from '@pebula/ngrid';

import { PblDropListRef } from './drop-list-ref';
import { PblDragDrop } from './drag-drop';

@Directive({
  selector: '[cdkLazyDropList]', // tslint:disable-line: directive-selector
  exportAs: 'cdkLazyDropList',
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST, useClass: CdkLazyDropList },
  ],
  host: { // tslint:disable-line:no-host-metadata-property
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  }
})
export class CdkLazyDropList<T = any, DRef = any> extends CdkDropList<T> implements OnInit {

  get pblDropListRef(): PblDropListRef<DRef> { return this._dropListRef as any; }

  get grid(): PblNgridComponent<T> { return this._gridApi?.grid; }
  set grid(value: PblNgridComponent<T>) { this.updateGrid(value); }

  get dir(): Direction | null { return this._gridApi?.getDirection(); }

  /**
   * Selector that will be used to determine the direct container element, starting from
   * the `cdkDropList` element and going down the DOM. Passing an alternate direct container element
   * is useful when the `cdkDropList` is not the direct parent (i.e. ancestor but not father)
   * of the draggable elements.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('cdkDropListDirectContainerElement') directContainerElement: string;

  protected get gridApi(): PblNgridExtensionApi<T> { return this._gridApi; }
  protected readonly originalElement: ElementRef<HTMLElement>;
  private _gridApi: PblNgridExtensionApi<T>;

  constructor(@Optional() grid: PblNgridComponent<T>,
              element: ElementRef<HTMLElement>,
              dragDrop: DragDrop,
              changeDetectorRef: ChangeDetectorRef,
              _scrollDispatcher?: ScrollDispatcher,
              @Optional() dir?: Directionality,
              @Optional() @Inject(CDK_DROP_LIST_GROUP) @SkipSelf() group?: CdkDropListGroup<CdkDropList>,
              @Optional() @Inject(CDK_DRAG_CONFIG) config?: DragDropConfig) {
    super(element, dragDrop, changeDetectorRef, _scrollDispatcher, dir, group, config);

    if (!(this.pblDropListRef instanceof PblDropListRef)) {
      throw new Error('Invalid `DropListRef` injection, the ref is not an instance of PblDropListRef')
    }
    this.initDropListRef();

    // This is a workaround for https://github.com/angular/material2/pull/14153
    // Working around the missing capability for selecting a container element that is not the drop container host.
    this.originalElement = element;

    if (grid) {
      this.updateGrid(grid);
    }
  }

  ngOnInit(): void {
    this._dropListRef.beforeStarted.subscribe( () => this.beforeStarted() );
  }

  addDrag(drag: CdkDrag): void {
    this.addItem(drag);
  }

  removeDrag(drag: CdkDrag): void {
    this.removeItem(drag);
  }

  /**
   * A chance for inheriting implementations to change/modify the drop list ref instance
   *
   * We can't do this via a DragDrop service replacement as we might have multiple drop-lists on the same
   * element which mean they must share the same DragDrop factory...
   */
  protected initDropListRef(): void { }

  protected beforeStarted(): void {
    if (this.directContainerElement) {
      const element = this.originalElement.nativeElement.querySelector(this.directContainerElement) as HTMLElement;
      this.element = new ElementRef<HTMLElement>(element);
    } else {
      this.element = this.originalElement;
    }
    this.pblDropListRef.withElement(this.element);
    if (this.dir) {
      this.pblDropListRef.withDirection(this.dir);
    }
  }

  protected gridChanged(prev?: PblNgridExtensionApi<T>) { }

  private updateGrid(grid: PblNgridComponent<T>) {
    if (grid !== this.grid) {
      const prev = this._gridApi;
      this._gridApi = grid ? PblNgridPluginController.find(grid).extApi : undefined;
      this.gridChanged(prev);
    }
  }
}
