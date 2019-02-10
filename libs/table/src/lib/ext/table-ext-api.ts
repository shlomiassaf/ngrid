import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { PblCdkTableComponent } from '../table';
import { ContextApi } from '../table/context/context';
import { PblTableComponent } from '../table/table.component';
import { PblColumnStore } from '../table/columns/column-store';
import { DynamicColumnWidthLogic } from '../table/col-width-logic/dynamic-column-width';
import { PblCdkVirtualScrollViewportComponent } from '../table/features/virtual-scroll/virtual-scroll-viewport.component'
import { PblTableEvents } from './types';
import { PblTableMetaRowService } from '../table/meta-rows/index';

export const EXT_API_TOKEN = new InjectionToken('NEG_TABLE_EXTERNAL_API');

export interface PblTableExtensionApi<T = any> {
  table: PblTableComponent<T>;
  element: HTMLElement;
  cdkTable: PblCdkTableComponent<T>;
  columnStore: PblColumnStore;
  contextApi: ContextApi<T>;
  events: Observable<PblTableEvents>;
  metaRowService: PblTableMetaRowService;
  onInit(fn: () => void): void;
  setViewport(viewport: PblCdkVirtualScrollViewportComponent): void;
  dynamicColumnWidthFactory(): DynamicColumnWidthLogic;
}
