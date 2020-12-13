// tslint:disable:no-output-rename
import { Directive, Input, OnInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DragDrop, CdkDragDrop, CDK_DROP_LIST } from '@angular/cdk/drag-drop';

import { PblColumn, COLUMN } from '@pebula/ngrid';
import { PblDragDrop, PblDragRef } from '../core/index';
import { PblNgridColumnDragDirective } from './column-drag';
import { PblNgridColumnDragContainerDirective } from './column-drag-container';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    columnReorder?: PblNgridColumnReorderPluginDirective;
  }
}

export const COL_REORDER_PLUGIN_KEY: 'columnReorder' = 'columnReorder';

@Directive({
  selector: 'pbl-ngrid[columnReorder]', // tslint:disable-line: directive-selector
  exportAs: 'pblNgridColumnReorder',
  host: { // tslint:disable-line:no-host-metadata-property
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST, useExisting: PblNgridColumnReorderPluginDirective },
  ],
})
export class PblNgridColumnReorderPluginDirective<T = any> extends PblNgridColumnDragContainerDirective<T> implements OnInit {

  @Input() get columnReorder(): boolean { return this._columnReorder; };
  set columnReorder(value: boolean) {
    this._columnReorder = coerceBooleanProperty(value);
    this.sortingDisabled = !this._columnReorder;
  }

  /**
   * When true, will not move the column on drop.
   * Instead you need to handle the dropped event.
   */
  @Input() get manualOverride(): boolean { return this._manualOverride; };
  set manualOverride(value: boolean) { this._manualOverride = coerceBooleanProperty(value); }

  private _columnReorder = false;
  private _manualOverride = false;

  canDrag(column: COLUMN): boolean {
    return (this._columnReorder && (column as PblColumn).reorder) || super.canDrag(column);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dropped.subscribe( e => this._pblReset() );
    this.pblDropListRef.beforeExit.subscribe( e => this._pblReset() );
  }

  protected gridChanged() {
    super.gridChanged();
    this.dropped.subscribe( (event: CdkDragDrop<T, any>) => {
      if (!this.manualOverride && this._columnReorder) {
        this.grid.columnApi.moveColumn((event.item as PblNgridColumnDragDirective<T>).column, event.currentIndex);
      }
    });
  }

  private _pblReset(): void {
    this.dragging.next(false);
    const siblings: PblDragRef<PblNgridColumnDragDirective<T>>[] = this.getSortedItems().map( c => c._dragRef) as any;
    siblings.forEach((sibling, index) => {
      for (const c of sibling.data.getCells()) {
        c.style.transform = ``;
      }
    });
  }
}
