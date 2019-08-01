import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { FlexModule } from '@angular/flex-layout/flex';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { Angulartics2Module } from 'angulartics2';

import { GestureConfig } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NxModule } from '@nrwl/nx';

import {
  PblDemoAppSharedModule,
  MarkdownPageContainerComponent,
  MarkdownPageViewerComponent,
  EXAMPLE_COMPONENTS,
  EXAMPLE_COMPONENTS_TOKEN,
  CONTENT_CHUNKS_COMPONENTS,
  LocationService,
  LazyModuleStoreService, LazyModulePreloader,
} from '@pebula/apps/shared';

import { AppContentChunksModule, APP_CONTENT_CHUNKS } from '@pebula/apps/app-content-chunks';

import { environment } from '../environments/environment';
import { DemoHomePageComponent } from './demo-home-page/demo-home-page.component';
import { RouterLinkActiveNotify } from './demo-home-page/router-link-active-notify';

import { AppComponent } from './app.component';
import { LazyCodePartsModule } from './lazy-code-parts.module';

export function EXAMPLE_COMPONENTS_FACTORY() {
  return EXAMPLE_COMPONENTS;
}

@NgModule({
  declarations: [
    AppComponent,
    DemoHomePageComponent,
    RouterLinkActiveNotify
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexModule, ExtendedModule,
    NxModule.forRoot(),
    PblDemoAppSharedModule,
    AppContentChunksModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatTooltipModule,
    LazyCodePartsModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: '',
          pathMatch: 'full',
          component: MarkdownPageViewerComponent,
          data: { documentUrl: '/' },
        },
        {
          path: 'demos/complex-demo-1',
          pathMatch: 'full',
          component: MarkdownPageViewerComponent,
          data: { documentUrl: '/demos/complex-demo-1' },
        },
        {
          path: 'demos/virtual-scroll-performance',
          pathMatch: 'full',
          component: MarkdownPageViewerComponent,
          data: { documentUrl: '/demos/virtual-scroll-performance' },
        },
        {
          path: 'content',
          children: [
            {
              path: '**',
              component: MarkdownPageContainerComponent,
            }
          ]
        },
      ],
      {
        useHash: true,
        preloadingStrategy: LazyModulePreloader,
      },
    ),
    Angulartics2Module.forRoot({
      developerMode: !environment.production,
      pageTracking: {
        autoTrackVirtualPages: true,
      }
    }),
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: CONTENT_CHUNKS_COMPONENTS, useValue: APP_CONTENT_CHUNKS },
    { provide: EXAMPLE_COMPONENTS_TOKEN, useFactory: EXAMPLE_COMPONENTS_FACTORY },
    LocationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(store: LazyModuleStoreService, lazyPreloader: LazyModulePreloader) {
    lazyPreloader.onCompile.subscribe( event => store.moduleRegistered(event) );
  }
}

