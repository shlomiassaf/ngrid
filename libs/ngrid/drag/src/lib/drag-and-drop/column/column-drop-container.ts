// tslint:disable:no-output-rename

import {
  Inject,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  OnDestroy,
  Optional,
  SkipSelf,
  Input,
  Output
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import {
  DragDrop,
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CDK_DROP_LIST,
  CDK_DROP_LIST_GROUP,
  CDK_DRAG_CONFIG,
  DragDropConfig
} from '@angular/cdk/drag-drop';

import { PblNgridComponent, PblNgridPluginController, PblColumn } from '@pebula/ngrid';
import { CdkLazyDropList } from '../core/lazy-drag-drop';
import { PblDragRef } from '../core/drag-ref';
import { PblDropListRef } from '../core/drop-list-ref';
import { PblNgridColumnDragDirective, PblNgridColumnReorderPluginDirective } from './column-reorder-plugin';
import { PblDragDrop } from '../core/drag-drop';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { EventEmitter } from '@angular/core';

let _uniqueIdCounter = 0;

@Directive({
  selector: '[pblColumnDropContainer]',
  exportAs: 'pblColumnDropContainer',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST_GROUP, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridColumnDropContainerDirective },
  ],
})
export class PblNgridColumnDropContainerDirective<T = any> extends CdkDropList<T> implements OnDestroy, CdkLazyDropList<T> {
  id = `pbl-ngrid-column-drop-container-${_uniqueIdCounter++}`;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Input('pblColumnDropContainer') set grid(value: PblNgridComponent<T>) { this.updateGrid(value); }

  @Output() columnEntered = new EventEmitter<PblDragRef<PblNgridColumnDragDirective<any>>>();
  @Output() columnExited = new EventEmitter<PblDragRef<PblNgridColumnDragDirective<any>>>();
  @Output() columnDropped = new EventEmitter<PblDragRef<PblNgridColumnDragDirective<any>>>();

  private _grid: PblNgridComponent<T>;
  private columnContainer: PblNgridColumnReorderPluginDirective;

  constructor(@Optional() grid: PblNgridComponent<T>,
              element: ElementRef<HTMLElement>,
              dragDrop: DragDrop,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() dir?: Directionality,
              @Optional() @Inject(CDK_DROP_LIST_GROUP) @SkipSelf() group?: CdkDropListGroup<CdkDropList>,
              _scrollDispatcher?: ScrollDispatcher,
              @Optional() @Inject(CDK_DRAG_CONFIG) config?: DragDropConfig) {
    super(element, dragDrop, changeDetectorRef, dir, group, _scrollDispatcher, config);
    if (grid) {
      this.updateGrid(grid);
    }
  }

  /**
   * Selector that will be used to determine the direct container element, starting from
   * the `cdkDropList` element and going down the DOM. Passing an alternate direct container element
   * is useful when the `cdkDropList` is not the direct parent (i.e. ancestor but not father)
   * of the draggable elements.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('cdkDropListDirectContainerElement') directContainerElement: string;

  get pblDropListRef(): PblDropListRef<any> { return this._dropListRef as any; }
  originalElement: ElementRef<HTMLElement>;
  ngOnInit(): void {
    CdkLazyDropList.prototype.ngOnInit.call(this);
    this.pblDropListRef.dropped
      .subscribe( event => this.columnDropped.next(event.item as PblDragRef<PblNgridColumnDragDirective<any>>) );

    this.pblDropListRef.entered
      .subscribe( event => this.columnEntered.next(event.item as PblDragRef<PblNgridColumnDragDirective<any>>) );

    this.pblDropListRef.exited
      .subscribe( event => this.columnExited.next(event.item as PblDragRef<PblNgridColumnDragDirective<any>>) );
  }

  addDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.addDrag.call(this, drag); }
  removeDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.removeDrag.call(this, drag); }
  beforeStarted(): void { CdkLazyDropList.prototype.beforeStarted.call(this); }
  /* CdkLazyDropList end */

  ngOnDestroy() {
    if (this.columnContainer) {
      this.columnContainer.disconnectFrom(this);
    }
  }

  private updateGrid(grid: PblNgridComponent<T>) {
    if (grid !== this._grid) {
      if (this.columnContainer) {
        this.columnContainer.disconnectFrom(this);
      }

      this._grid = grid;
      const pluginCtrl = PblNgridPluginController.find(grid)
      this.columnContainer = pluginCtrl.getPlugin('columnReorder');
      this.columnContainer.connectTo(this);
    }
  }
}
