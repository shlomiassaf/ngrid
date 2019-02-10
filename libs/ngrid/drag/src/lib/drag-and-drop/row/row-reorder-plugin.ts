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

import { PblNgridComponent, TablePlugin, PblNgridPluginController, PblNgridCellContext } from '@pebula/ngrid';
import { CdkLazyDropList, CdkLazyDrag } from '../core';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    rowReorder?: PblNgridRowReorderPluginDirective;
  }
}

const PLUGIN_KEY: 'rowReorder' = 'rowReorder';

let _uniqueIdCounter = 0;

@TablePlugin({ id: PLUGIN_KEY })
@Directive({
  selector: 'pbl-ngrid[rowReorder]',
  exportAs: 'pblNgridRowReorder',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
    '[class.pbl-row-reorder]': 'rowReorder && !this.table.ds?.sort.sort?.order && !this.table.ds?.filter?.filter',
  },
  providers: [
    { provide: CdkDropListGroup, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridRowReorderPluginDirective },
  ],
})
export class PblNgridRowReorderPluginDirective<T = any> extends CdkLazyDropList<T> implements OnDestroy {

  id = `pbl-ngrid-row-reorder-list-${_uniqueIdCounter++}`;

  @Input() get rowReorder(): boolean { return this._rowReorder; };
  set rowReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._rowReorder = value;
  }
  private _rowReorder = false;
  private _removePlugin: (table: PblNgridComponent<any>) => void;

  constructor(public table: PblNgridComponent<T>,
              pluginCtrl: PblNgridPluginController,
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
  selector: '[pblNgridRowDrag]',
  exportAs: 'pblNgridRowDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [
    { provide: CdkDrag, useExisting: PblNgridRowDragDirective }
  ]
})
export class PblNgridRowDragDirective<T = any> extends CdkLazyDrag<T, PblNgridRowReorderPluginDirective<T>> implements AfterViewInit {
  rootElementSelector = 'pbl-ngrid-row';

  @Input('pblNgridRowDrag') set context(value: Pick<PblNgridCellContext<T>, 'col' | 'table'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>) {
    this._context = value;

    const pluginCtrl = this.pluginCtrl = value && PblNgridPluginController.find(value.table);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
  }

  private _context: Pick<PblNgridCellContext<T>, 'col' | 'table'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>
  private pluginCtrl: PblNgridPluginController;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }
}
