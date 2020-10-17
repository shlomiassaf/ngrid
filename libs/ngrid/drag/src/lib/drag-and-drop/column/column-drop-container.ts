// tslint:disable:no-output-rename
import { Directive, EventEmitter, Output } from '@angular/core';
import { DragDrop, CDK_DROP_LIST, CDK_DROP_LIST_GROUP } from '@angular/cdk/drag-drop';

import { CdkLazyDropList, PblDragRef, PblDragDrop } from '../core/index';
import { PblNgridColumnDragDirective, PblNgridColumnReorderPluginDirective } from './column-reorder-plugin';

let _uniqueIdCounter = 0;

@Directive({
  selector: '[pblColumnDropContainer]',
  exportAs: 'pblColumnDropContainer',
  inputs: ['grid: pblColumnDropContainer'],
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
export class PblNgridColumnDropContainerDirective<T = any> extends CdkLazyDropList<T> {
  id = `pbl-ngrid-column-drop-container-${_uniqueIdCounter++}`;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Output() columnEntered = new EventEmitter<PblDragRef<PblNgridColumnDragDirective<any>>>();
  @Output() columnExited = new EventEmitter<PblDragRef<PblNgridColumnDragDirective<any>>>();
  @Output() columnDropped = new EventEmitter<PblDragRef<PblNgridColumnDragDirective<any>>>();

  private columnContainer: PblNgridColumnReorderPluginDirective;

  ngOnInit(): void {
    super.ngOnInit();
    this.pblDropListRef.dropped
      .subscribe( event => this.columnDropped.next(event.item as PblDragRef<PblNgridColumnDragDirective<any>>) );

    this.pblDropListRef.entered
      .subscribe( event => this.columnEntered.next(event.item as PblDragRef<PblNgridColumnDragDirective<any>>) );

    this.pblDropListRef.exited
      .subscribe( event => this.columnExited.next(event.item as PblDragRef<PblNgridColumnDragDirective<any>>) );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.columnContainer) {
      this.columnContainer.disconnectFrom(this);
    }
  }

  protected gridChanged() {
    if (this.columnContainer) {
      this.columnContainer.disconnectFrom(this);
    }
    if (this.gridApi) {
      this.columnContainer = this.gridApi.pluginCtrl.getPlugin('columnReorder');
      this.columnContainer.connectTo(this);
    } else {
      this.columnContainer = undefined;
    }
  }

}
