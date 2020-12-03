// tslint:disable:no-output-rename
import { Directive, OnInit } from '@angular/core';
import { DragDrop, CDK_DROP_LIST, CDK_DROP_LIST_GROUP } from '@angular/cdk/drag-drop';

import { PblColumn } from '@pebula/ngrid';
import { CdkLazyDropList, PblDragRef, PblDragDrop } from '../core/index';
import { PblNgridColumnReorderPluginDirective } from './column-reorder-plugin';
import { PblNgridColumnDragDirective } from './column-drag';

let _uniqueIdCounter = 0;

@Directive({
  selector: '[pblAggregationContainer]',
  exportAs: 'pblAggregationContainer',
  host: { // tslint:disable-line:no-host-metadata-property
    'class': 'cdk-drop-list',
    '[id]': 'id',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST_GROUP, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridAggregationContainerDirective },
  ],
})
export class PblNgridAggregationContainerDirective<T = any> extends CdkLazyDropList<T> implements OnInit {
  id = `pbl-ngrid-column-aggregation-container-${_uniqueIdCounter++}`;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  pending: PblColumn;

  columnContainer: PblNgridColumnReorderPluginDirective;

  ngOnInit(): void {
    super.ngOnInit();
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

  ngOnDestroy() {
    super.ngOnDestroy();
    this.columnContainer.disconnectFrom(this);
  }

  protected gridChanged() {
    this.columnContainer = this.gridApi.pluginCtrl.getPlugin('columnReorder');
    this.columnContainer.connectTo(this);
  }
}
