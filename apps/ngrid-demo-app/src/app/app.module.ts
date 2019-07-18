import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { Angulartics2Module } from 'angulartics2';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NxModule } from '@nrwl/nx';

import { PblDemoAppSharedModule, MarkdownPageContainerComponent, EXAMPLE_COMPONENTS, EXAMPLE_COMPONENTS_TOKEN, CONTENT_CHUNKS_COMPONENTS } from '@pebula/apps/shared';
import { SharedModule } from '@pebula/apps/ngrid/shared';
import { ExampleModule } from '@pebula/apps/ngrid-examples';
import { AppContentChunksModule, APP_CONTENT_CHUNKS } from '@pebula/apps/app-content-chunks';

import { environment } from '../environments/environment';
import { DemoHomePageComponent } from './demo-home-page/demo-home-page.component';
import { RouterLinkActiveNotify } from './demo-home-page/router-link-active-notify';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoHomePageComponent,
    RouterLinkActiveNotify
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NxModule.forRoot(),
    PblDemoAppSharedModule,
    ExampleModule,
    AppContentChunksModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatTooltipModule,
    RouterModule.forRoot(
      [
        { path: '', loadChildren: () => import('@pebula/apps/ngrid/demos').then(m => m.DemosModule) },
        {
          path: 'content',
          children: [
            {
              path: '**',
              component: MarkdownPageContainerComponent,
            }
          ]
        },
        { path: 'extensions', loadChildren: () => import('@pebula/apps/ngrid/extensions').then(m => m.ExtensionsModule) },
        { path: 'stories', loadChildren: () => import('@pebula/apps/ngrid/stories').then(m => m.StoriesModule) },
      ],
      {
        useHash: true,
        preloadingStrategy: PreloadAllModules,
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
    { provide: EXAMPLE_COMPONENTS_TOKEN, useValue: EXAMPLE_COMPONENTS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

