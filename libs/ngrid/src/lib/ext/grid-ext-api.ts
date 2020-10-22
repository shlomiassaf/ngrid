import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { PblCdkTableComponent } from '../grid/pbl-cdk-table/pbl-cdk-table.component';
import { ContextApi } from '../grid/context/api';
import { PblNgridComponent } from '../grid/ngrid.component';
import { ColumnApi, PblColumnStore } from '../grid/column/management';
import { DynamicColumnWidthLogic } from '../grid/column/width-logic/dynamic-column-width';
import { PblCdkVirtualScrollViewportComponent } from '../grid/features/virtual-scroll/virtual-scroll-viewport.component'
import { NotifyPropChangeMethod, OnPropChangedEvent, PblNgridEvents } from './types';
import { PblNgridMetaRowService } from '../grid/meta-rows/index';
import { RowsApi, PblRowsApi } from '../grid/row';
import { PblNgridPluginContext, PblNgridPluginController } from './plugin-control';

export const EXT_API_TOKEN = new InjectionToken('PBL_NGRID_EXTERNAL_API');

export interface PblNgridExtensionApi<T = any> {
  grid: PblNgridComponent<T>;
  element: HTMLElement;
  propChanged: Observable<OnPropChangedEvent>;
  cdkTable: PblCdkTableComponent<T>;
  columnStore: PblColumnStore;
  contextApi: ContextApi<T>;
  columnApi: ColumnApi<T>;
  rowsApi: RowsApi<T>;
  events: Observable<PblNgridEvents>;
  metaRowService: PblNgridMetaRowService;
  pluginCtrl: PblNgridPluginController<T>;
  onConstructed(fn: () => void): void;
  onInit(fn: () => void): void;
  dynamicColumnWidthFactory(): DynamicColumnWidthLogic;
}

export interface PblNgridInternalExtensionApi<T = any> extends PblNgridExtensionApi<T> {
  viewport: PblCdkVirtualScrollViewportComponent;
  plugin: PblNgridPluginContext;
  rowsApi: PblRowsApi<T>;
  setViewport(viewport: PblCdkVirtualScrollViewportComponent): void;
  setCdkTable(cdkTable: PblCdkTableComponent<T>): void;
  notifyPropChanged: NotifyPropChangeMethod;
}
