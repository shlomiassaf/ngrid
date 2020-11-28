import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { PblCdkTableComponent } from '../grid/pbl-cdk-table/pbl-cdk-table.component';
import { ContextApi } from '../grid/context/api';
import { PblNgridComponent } from '../grid/ngrid.component';
import { PblColumnStore } from '../grid/columns/column-store';
import { DynamicColumnWidthLogic } from '../grid/col-width-logic/dynamic-column-width';
import { PblCdkVirtualScrollViewportComponent } from '../grid/features/virtual-scroll/virtual-scroll-viewport.component'
import { PblNgridEvents } from './types';
import { PblNgridMetaRowService } from '../grid/meta-rows/index';
import { Direction } from '@angular/cdk/bidi';

export const EXT_API_TOKEN = new InjectionToken('PBL_NGRID_EXTERNAL_API');

export interface PblNgridExtensionApi<T = any> {
  grid: PblNgridComponent<T>;
  element: HTMLElement;
  cdkTable: PblCdkTableComponent<T>;
  columnStore: PblColumnStore;
  contextApi: ContextApi<T>;
  events: Observable<PblNgridEvents>;
  metaRowService: PblNgridMetaRowService;
  onInit(fn: () => void): void;
  setViewport(viewport: PblCdkVirtualScrollViewportComponent): void;
  dynamicColumnWidthFactory(dir?: Direction): DynamicColumnWidthLogic;
}
