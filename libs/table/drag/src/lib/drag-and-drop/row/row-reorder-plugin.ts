import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  QueryList,
} from '@angular/core';

import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  CdkDropList,
  DragDropRegistry,
  CdkDrag,
  CDK_DROP_LIST_CONTAINER,
} from '@angular/cdk/drag-drop';

import { NegTableComponent, TablePlugin, NegTablePluginController, NegTableCellContext } from '@neg/table';
import { CdkLazyDropList, CdkLazyDrag } from '../lazy-drag-drop';

declare module '@neg/table/lib/ext/types' {
  interface NegTablePluginExtension {
    rowReorder?: NegTableRowReorderPluginDirective;
  }
}

const PLUGIN_KEY: 'rowReorder' = 'rowReorder';

let _uniqueIdCounter = 0;

@TablePlugin({ id: PLUGIN_KEY })
@Directive({
  selector: 'neg-table[rowReorder]',
  exportAs: 'negTableRowReorder',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.neg-row-reorder]': 'rowReorder && !this.table.ds?.sort.sort?.order && !this.table.ds?.filter?.filter',
  },
  providers: [
    { provide: CDK_DROP_LIST_CONTAINER, useExisting: NegTableRowReorderPluginDirective },
  ],
})
export class NegTableRowReorderPluginDirective<T = any> extends CdkLazyDropList<T> implements OnDestroy {

  id = `neg-table-row-reorder-list-${_uniqueIdCounter++}`;

  @Input() get rowReorder(): boolean { return this._rowReorder; };
  set rowReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._rowReorder = value;
  }
  private _rowReorder = false;
  private _removePlugin: (table: NegTableComponent<any>) => void;

  constructor(public table: NegTableComponent<T>,
              pluginCtrl: NegTablePluginController,
              element: ElementRef<HTMLElement>,
              dragDropRegistry: DragDropRegistry<CdkDrag, CdkDropList<T>>,
              changeDetectorRef: ChangeDetectorRef,
              @Optional() private dir?: Directionality) {
    super(element, dragDropRegistry, changeDetectorRef, dir);
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
  selector: '[negTableRowDrag]',
  exportAs: 'negTableRowDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_hasStartedDragging && _isDragging()',
  },
  providers: [
    { provide: CdkDrag, useExisting: NegTableRowDragDirective }
  ]
})
export class NegTableRowDragDirective<T = any> extends CdkLazyDrag<T, NegTableRowReorderPluginDirective<T>> implements AfterViewInit {
  rootElementSelector = 'neg-table-row';

  @Input('negTableRowDrag') set context(value: Pick<NegTableCellContext<T>, 'col' | 'table'> & Partial<Pick<NegTableCellContext<T>, 'row' | 'value'>>) {
    this._context = value;

    const pluginCtrl = this.pluginCtrl = value && NegTablePluginController.find(value.table);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
  }

  private _context: Pick<NegTableCellContext<T>, 'col' | 'table'> & Partial<Pick<NegTableCellContext<T>, 'row' | 'value'>>
  private pluginCtrl: NegTablePluginController;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }
}
