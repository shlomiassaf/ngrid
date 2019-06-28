import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalModule } from '@angular/cdk/portal';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';

import { DocsiTocModule } from '@pebula-internal/docsi/toc';

import {
  MarkdownPageContainerComponent,
  MarkdownPageViewerComponent,
  ExampleViewComponent,
  ContentChunkViewComponent,
  ExampleAssetFileViewComponent,
 } from './components';


const DECLARATION_EXPORT = [
  MarkdownPageContainerComponent,
  MarkdownPageViewerComponent,
  ExampleViewComponent,
  ContentChunkViewComponent,
  ExampleAssetFileViewComponent,
]

@NgModule({
  declarations: [
    DECLARATION_EXPORT
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortalModule,
    MatIconModule, MatButtonModule, MatListModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatProgressBarModule,
    FlexModule, ExtendedModule,

    PblNgridModule,

    DocsiTocModule,
  ],
  exports: [
    DECLARATION_EXPORT,

    PblNgridModule
  ],
  providers: [
    PblNgridRegistryService,
  ],
  entryComponents: [ ExampleViewComponent, ContentChunkViewComponent ],
})
export class PblDemoAppSharedModule {

}
