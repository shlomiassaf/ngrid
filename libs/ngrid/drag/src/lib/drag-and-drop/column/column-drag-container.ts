// tslint:disable:no-output-rename
import { BehaviorSubject, Subject } from 'rxjs';
import { Directive, Input, Output } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { DragDrop, CDK_DROP_LIST, CdkDropList } from '@angular/cdk/drag-drop';

import { COLUMN, PblNgridComponent } from '@pebula/ngrid';
import { CdkLazyDropList, PblDragDrop } from '../core/index';
import { patchDropListRef } from './column-drop-list-ref';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    columnDrag?: PblNgridColumnDragContainerDirective;
  }
}

export const COL_DRAG_CONTAINER_PLUGIN_KEY: 'columnDrag' = 'columnDrag';

let _uniqueIdCounter = 0;

@Directive({
  selector: 'pbl-ngrid[columnDrag]:not([columnReorder])',
  exportAs: 'pblNgridColumnDragContainer',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST, useExisting: PblNgridColumnDragContainerDirective },
  ],
})
export class PblNgridColumnDragContainerDirective<T = any> extends CdkLazyDropList<T, PblNgridColumnDragContainerDirective<T>> {
  id = `pbl-ngrid-column-drag-container-list-${_uniqueIdCounter++}`;
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Input() get columnDrag(): boolean { return this._columnDrag; };
  set columnDrag(value: boolean) {
    this._columnDrag = coerceBooleanProperty(value);
  }

  @Output('cdkDropDragging') dragging: BehaviorSubject<boolean>;

  @Output('cdkDropConnectionsChanged') connectionsChanged: Subject<void>;


  private _columnDrag = false;
  private _removePlugin: (table: PblNgridComponent<any>) => void;

  private connections = new Set<CdkDropList>();

  hasConnections() {
    return this.connections.size > 0;
  }

  canDrag(column: COLUMN): boolean {
    return this.connections.size > 0;
  }

  connectTo(dropList: CdkDropList) {
    if (!this.connections.has(dropList)) {
      this.connections.add(dropList);
      this.connectedTo = Array.from(this.connections);
      this.connectionsChanged.next();
    }
  }

  disconnectFrom(dropList: CdkDropList) {
    if (this.connections.delete(dropList)) {
      this.connectedTo = Array.from(this.connections);
      this.connectionsChanged.next();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.connectionsChanged.complete();
    this.dragging.complete();
    this._removePlugin(this.grid);
  }

  protected initDropListRef(): void {
    patchDropListRef(this.pblDropListRef as any);
  }

  protected beforeStarted(): void {
    super.beforeStarted();
    this.dragging.next(true);
  }

  protected gridChanged() {
    this.dragging = new BehaviorSubject<boolean>(false);
    this.connectionsChanged = new Subject<void>();

    this._removePlugin = this.gridApi.pluginCtrl.setPlugin(COL_DRAG_CONTAINER_PLUGIN_KEY, this);

    this.directContainerElement = '.pbl-ngrid-header-row-main';

    this.dragging.subscribe( isDragging => {
      const el = this.originalElement.nativeElement;
      if (isDragging) {
        el.classList.add('pbl-ngrid-column-list-dragging');
      } else {
        el.classList.remove('pbl-ngrid-column-list-dragging');
      }
    });

    this.sortingDisabled = true;
  }

  static ngAcceptInputType_columnDrag: BooleanInput;
}
