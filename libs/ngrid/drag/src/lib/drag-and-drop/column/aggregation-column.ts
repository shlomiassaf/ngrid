// tslint:disable:no-output-rename

import {
  Inject,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  OnDestroy,
  Optional,
  SkipSelf,
  Input
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import {
  DragDrop,
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CDK_DROP_LIST,
  DragDropRegistry,
  CDK_DROP_LIST_GROUP,
  CDK_DRAG_CONFIG,
  DragDropConfig
} from '@angular/cdk/drag-drop';

import { PblNgridComponent, PblNgridPluginController, PblColumn } from '@pebula/ngrid';
import { CdkLazyDropList } from '../core/lazy-drag-drop';
import { PblDragRef } from '../core/drag-ref';
import { PblDropListRef } from '../core/drop-list-ref';
import { PblNgridColumnDragDirective } from './column-reorder-plugin';
import { PblDragDrop } from '../core/drag-drop';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

let _uniqueIdCounter = 0;

@Directive({
  selector: '[pblAggregationContainer]',
  exportAs: 'pblAggregationContainer',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST_GROUP, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridAggregationContainerDirective },
  ],
})
export class PblNgridAggregationContainerDirective<T = any> extends CdkDropList<T> implements OnDestroy, CdkLazyDropList<T> {
  id = `pbl-ngrid-column-aggregation-container-${_uniqueIdCounter++}`;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  pending: PblColumn;

  constructor(public grid: PblNgridComponent<T>,
              pluginCtrl: PblNgridPluginController,
              element: ElementRef<HTMLElement>,
              dragDrop: DragDrop,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() dir?: Directionality,
              @Optional() @Inject(CDK_DROP_LIST_GROUP) @SkipSelf() group?: CdkDropListGroup<CdkDropList>,
              _scrollDispatcher?: ScrollDispatcher,
              @Optional() @Inject(CDK_DRAG_CONFIG) config?: DragDropConfig) {
    super(element, dragDrop, changeDetectorRef, dir, group, _scrollDispatcher, config);
    const reorder = pluginCtrl.getPlugin('columnReorder');
    reorder.connectedTo = this;
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
      .subscribe( event => {
        const item = event.item as PblDragRef<PblNgridColumnDragDirective<any>>;
        this.pending = undefined;
        this.grid.columnApi.addGroupBy(item.data.column);
      });

    this.pblDropListRef.entered
      .subscribe( event => {
        const item = event.item as PblDragRef<PblNgridColumnDragDirective<any>>;
        this.pending = item.data.column;
        item.getPlaceholderElement().style.display = 'none';
        for (const c of item.data.getCells()) {
          c.style.display = 'none';
        }
      });

    this.pblDropListRef.exited
      .subscribe( event => {
        const item = event.item as PblDragRef<PblNgridColumnDragDirective<any>>;
        this.pending = undefined;
        item.getPlaceholderElement().style.display = '';
        for (const c of item.data.getCells()) {
          c.style.display = '';
        }
      });
  }
  addDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.addDrag.call(this, drag); }
  removeDrag(drag: CdkDrag): void { return CdkLazyDropList.prototype.removeDrag.call(this, drag); }
  beforeStarted(): void { CdkLazyDropList.prototype.beforeStarted.call(this); }
  /* CdkLazyDropList end */

}
