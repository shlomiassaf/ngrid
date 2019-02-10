// tslint:disable:no-output-rename

import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  OnDestroy,
  Optional,
  Inject,
  SkipSelf,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Directionality } from '@angular/cdk/bidi';
import {
  DragDrop,
  CdkDropListGroup,
  CdkDropList,
  CdkDropListContainer,
  DragDropRegistry,
  CDK_DROP_LIST,
  DragRef, DropListRef
} from '@angular/cdk/drag-drop';

import { NegTableComponent, NegTablePluginController, NegColumn } from '@pebula/table';
import { CdkLazyDropList, NegDragRef } from '../core';
import { NegTableColumnDragDirective } from './column-reorder-plugin';

let _uniqueIdCounter = 0;

@Directive({
  selector: '[negAggregationContainer]',
  exportAs: 'negAggregationContainer',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
  },
  providers: [
    { provide: CDK_DROP_LIST, useExisting: NegTableAggregationContainerDirective },
  ],
})
export class NegTableAggregationContainerDirective<T = any> extends CdkLazyDropList<T> implements OnDestroy {
  id = `pbl-table-column-aggregation-container-${_uniqueIdCounter++}`;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  pending: NegColumn;

  constructor(public table: NegTableComponent<T>,
              pluginCtrl: NegTablePluginController,
              element: ElementRef<HTMLElement>,
              dragDropRegistry: DragDropRegistry<DragRef, DropListRef<T>>,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() dir?: Directionality,
              @Optional() @SkipSelf() group?: CdkDropListGroup<CdkDropList>,
              @Optional() @Inject(DOCUMENT) _document?: any,
              dragDrop?: DragDrop) {
    super(element, dragDropRegistry as any, changeDetectorRef, dir, group, _document, dragDrop);
    const reorder = pluginCtrl.getPlugin('columnReorder');
    reorder.connectedTo = this.id;

    this.negDropListRef.dropped
      .subscribe( event => {
        const item = event.item as NegDragRef<NegTableColumnDragDirective<any>>;
        this.pending = undefined;
        this.table.columnApi.addGroupBy(item.data.column);
      });

    this.negDropListRef.entered
      .subscribe( event => {
        const item = event.item as NegDragRef<NegTableColumnDragDirective<any>>;
        this.pending = item.data.column;
        item.getPlaceholderElement().style.display = 'none';
        for (const c of item.data.getCells()) {
          c.style.display = 'none';
        }
      });

    this.negDropListRef.exited
      .subscribe( event => {
        const item = event.item as NegDragRef<NegTableColumnDragDirective<any>>;
        this.pending = undefined;
        item.getPlaceholderElement().style.display = '';
        for (const c of item.data.getCells()) {
          c.style.display = '';
        }
      });
  }
}
