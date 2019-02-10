import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  Inject,
  OnDestroy,
  Optional,
  SkipSelf,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DragDrop,
  CdkDropList,
  CdkDropListGroup,
  DragDropRegistry,
  CdkDrag,
  CDK_DROP_LIST,
  DragRef, DropListRef
} from '@angular/cdk/drag-drop';

import { PblTableComponent, TablePlugin, PblTablePluginController, PblTableCellContext } from '@pebula/table';
import { CdkLazyDropList, CdkLazyDrag } from '../core';

declare module '@pebula/table/lib/ext/types' {
  interface PblTablePluginExtension {
    rowReorder?: PblTableRowReorderPluginDirective;
  }
}

const PLUGIN_KEY: 'rowReorder' = 'rowReorder';

let _uniqueIdCounter = 0;

@TablePlugin({ id: PLUGIN_KEY })
@Directive({
  selector: 'pbl-table[rowReorder]',
  exportAs: 'pblTableRowReorder',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
    '[class.pbl-row-reorder]': 'rowReorder && !this.table.ds?.sort.sort?.order && !this.table.ds?.filter?.filter',
  },
  providers: [
    { provide: CdkDropListGroup, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblTableRowReorderPluginDirective },
  ],
})
export class PblTableRowReorderPluginDirective<T = any> extends CdkLazyDropList<T> implements OnDestroy {

  id = `pbl-table-row-reorder-list-${_uniqueIdCounter++}`;

  @Input() get rowReorder(): boolean { return this._rowReorder; };
  set rowReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._rowReorder = value;
  }
  private _rowReorder = false;
  private _removePlugin: (table: PblTableComponent<any>) => void;

  constructor(public table: PblTableComponent<T>,
              pluginCtrl: PblTablePluginController,
              element: ElementRef<HTMLElement>,
              dragDropRegistry: DragDropRegistry<DragRef, DropListRef<T>>,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() dir?: Directionality,
              @Optional() @SkipSelf() group?: CdkDropListGroup<CdkDropList>,
              @Optional() @Inject(DOCUMENT) _document?: any,
              dragDrop?: DragDrop) {
    super(element, dragDropRegistry as any, changeDetectorRef, dir, group, _document, dragDrop);
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
    this.dropped.subscribe( event => {
      this.table.ds.moveItem(event.previousIndex, event.currentIndex);
      this.table._cdkTable.syncRows('data');
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removePlugin(this.table);
  }
}

@Directive({
  selector: '[pblTableRowDrag]',
  exportAs: 'pblTableRowDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [
    { provide: CdkDrag, useExisting: PblTableRowDragDirective }
  ]
})
export class PblTableRowDragDirective<T = any> extends CdkLazyDrag<T, PblTableRowReorderPluginDirective<T>> implements AfterViewInit {
  rootElementSelector = 'pbl-table-row';

  @Input('pblTableRowDrag') set context(value: Pick<PblTableCellContext<T>, 'col' | 'table'> & Partial<Pick<PblTableCellContext<T>, 'row' | 'value'>>) {
    this._context = value;

    const pluginCtrl = this.pluginCtrl = value && PblTablePluginController.find(value.table);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
  }

  private _context: Pick<PblTableCellContext<T>, 'col' | 'table'> & Partial<Pick<PblTableCellContext<T>, 'row' | 'value'>>
  private pluginCtrl: PblTablePluginController;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }
}
