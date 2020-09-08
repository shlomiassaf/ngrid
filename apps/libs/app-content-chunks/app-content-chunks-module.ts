import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { LiveExample } from '@pebula/apps/shared';

import { ExampleMaterialModule } from './material-module';
import { PblNgridModule } from '@pebula/ngrid';

import { GridLayout1ContentChunk } from './grid/layout-1/layout-1.component';
import { ColumnsAppContentChunk } from './columns/columns-content.component';
import { HomePageAppContentChunk } from './home-page/home-page.component';

export const APP_CONTENT_CHUNKS_LIST = [
  GridLayout1ContentChunk,
  ColumnsAppContentChunk,
  HomePageAppContentChunk,
]

export const APP_CONTENT_CHUNKS: {[key: string]: LiveExample} = {
  'pbl-grid-layout-1': {
    title: '',
    component: GridLayout1ContentChunk,
    additionalFiles: [],
    selectorName: ''
  },
  'pbl-columns-app-content-chunk': {
    title: '',
    component: ColumnsAppContentChunk,
    additionalFiles: [],
    selectorName: ''
  },
  'pbl-home-page-app-content-chunk': {
    title: '',
    component: HomePageAppContentChunk,
    additionalFiles: [],
    selectorName: ''
  }
};

@NgModule({
  declarations: APP_CONTENT_CHUNKS_LIST,
  imports: [
    CommonModule,
    FlexModule,
    ExtendedModule,
    PblNgridModule,
    ExampleMaterialModule,
  ]
})
export class AppContentChunksModule { }
