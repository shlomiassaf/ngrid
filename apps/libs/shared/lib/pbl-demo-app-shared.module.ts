import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortalModule } from '@angular/cdk/portal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';

import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';

import { PblTocModule } from './toc.module';

import {
  MarkdownPageContainerComponent,
  MarkdownPageViewerComponent,
  ExampleViewComponent,
  ContentChunkViewComponent,
  ExampleAssetFileViewComponent,
  NgCustomLogoComponent,
  DemoActionRowComponent,
  AppSearchInput,
  AppSearchResults,
 } from './components';

import { NgEventsDirective } from './directives/ng-hooks';
import { ContentChunkViewGhostDirective, ExampleViewGhostDirective } from './directives/ghosts';
import { PblNegatePipe } from './pipes';

const PIPES_EXPORT = [
  PblNegatePipe
];

const DECLARATION_EXPORT = [
  MarkdownPageContainerComponent,
  MarkdownPageViewerComponent,
  ExampleViewComponent,
  ContentChunkViewComponent,
  ExampleAssetFileViewComponent,
  NgCustomLogoComponent,
  NgEventsDirective,
  DemoActionRowComponent,
  AppSearchInput,
  AppSearchResults,
  ContentChunkViewGhostDirective, ExampleViewGhostDirective,
]

@NgModule({
  declarations: [
    DECLARATION_EXPORT,
    PIPES_EXPORT,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PortalModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatMenuModule, MatCheckboxModule, MatListModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatProgressBarModule, MatProgressSpinnerModule,
    FlexModule, ExtendedModule,

    PblNgridModule,

    PblTocModule,
  ],
  exports: [
    DECLARATION_EXPORT,
    PIPES_EXPORT,

    PblNgridModule
  ],
  providers: [
    PblNgridRegistryService,
  ],
})
export class PblDemoAppSharedModule {

}
