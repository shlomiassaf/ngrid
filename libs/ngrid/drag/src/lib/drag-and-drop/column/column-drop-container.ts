// tslint:disable:no-output-rename
import { Directive, EventEmitter, Output } from '@angular/core';
import { DragDrop, CDK_DROP_LIST, CDK_DROP_LIST_GROUP } from '@angular/cdk/drag-drop';
import { COLUMN } from '@pebula/ngrid';
import { CdkLazyDropList, PblDragDrop } from '../core/index';
import { COL_DRAG_CONTAINER_PLUGIN_KEY, PblNgridColumnDragContainerDirective } from './column-drag-container';
import { PblColumnDragDropContainerDrop, PblColumnDragDropContainerEnter, PblColumnDragDropContainerExit } from './column-drop-container.events';

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

  @Output() columnEntered: EventEmitter<PblColumnDragDropContainerEnter<T>> = this.entered as any;
  @Output() columnExited: EventEmitter<PblColumnDragDropContainerDrop<T>> = this.exited as any;
  @Output() columnDropped: EventEmitter<PblColumnDragDropContainerExit<T>> = this.dropped as any;

  get columnContainer(): PblNgridColumnDragContainerDirective { return this._columnContainer; }
  private _columnContainer: PblNgridColumnDragContainerDirective;

  canDrag(column: COLUMN): boolean {
    return true;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._columnContainer) {
      this._columnContainer.disconnectFrom(this);
    }
  }

  protected gridChanged() {
    const columnContainer = this.gridApi?.pluginCtrl.getPlugin(COL_DRAG_CONTAINER_PLUGIN_KEY)
    if (columnContainer !== this._columnContainer) {
      if (this._columnContainer) {
        this._columnContainer.disconnectFrom(this);
      }
      this._columnContainer = columnContainer;
      if (columnContainer) {
        columnContainer.connectTo(this);
      }
    }
  }

}
