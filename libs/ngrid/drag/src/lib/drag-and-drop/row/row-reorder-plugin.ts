import { Directive, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DragDrop,
  CdkDropListGroup,
  CDK_DROP_LIST,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';

import { PblNgridComponent } from '@pebula/ngrid';
import { PblDragDrop, CdkLazyDropList } from '../core/index';
import { PblNgridRowDragDirective } from './row-drag';

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
    '[class.pbl-row-reorder]': 'rowReorder && !this.grid.ds?.sort.sort?.order && !this.grid.ds?.filter?.filter',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CdkDropListGroup, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridRowReorderPluginDirective },
  ],
})
export class PblNgridRowReorderPluginDirective<T = any> extends CdkLazyDropList<T, PblNgridRowReorderPluginDirective<T>> {

  id = `pbl-ngrid-row-reorder-list-${_uniqueIdCounter++}`;

  @Input() get rowReorder(): boolean { return this._rowReorder; };
  set rowReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._rowReorder = value;
  }

  private _rowReorder = false;
  private _removePlugin: (grid: PblNgridComponent<any>) => void;

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removePlugin(this.grid);
  }

  protected gridChanged() {
    this._removePlugin = this.gridApi.pluginCtrl.setPlugin(ROW_REORDER_PLUGIN_KEY, this);

    this.dropped.subscribe( (event: CdkDragDrop<T>) => {
      const item = event.item as PblNgridRowDragDirective<T>;

      const previousIndex = this.grid.ds.source.indexOf(item.draggedContext.row);
      const currentIndex = event.currentIndex + this.grid.ds.renderStart;

      this.grid.contextApi.clear();
      this.grid.ds.moveItem(previousIndex, currentIndex, true);
      this.grid.rowsApi.syncRows('data');
    });
  }
}
