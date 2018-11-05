import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { NegCdkTableComponent } from '../table';
import { ContextApi } from '../table/context/context';
import { NegTableComponent } from '../table/table.component';
import { NegColumnStore } from '../table/columns/column-store';
import { DynamicColumnWidthLogic } from '../table/col-width-logic/dynamic-column-width';
import { NegCdkVirtualScrollViewportComponent } from '../table/features/virtual-scroll/virtual-scroll-viewport.component'
import { NegTableEvents } from './types';
import { NegTableMetaRowService } from '../table/meta-rows/index';

export const EXT_API_TOKEN = new InjectionToken('NEG_TABLE_EXTERNAL_API');

export interface NegTableExtensionApi<T = any> {
  table: NegTableComponent<T>;
  element: HTMLElement;
  cdkTable: NegCdkTableComponent<T>;
  columnStore: NegColumnStore;
  contextApi: ContextApi<T>;
  events: Observable<NegTableEvents>;
  metaRowService: NegTableMetaRowService;
  onInit(fn: () => void): void;
  setViewport(viewport: NegCdkVirtualScrollViewportComponent): void;
  dynamicColumnWidthFactory(): DynamicColumnWidthLogic;
}
