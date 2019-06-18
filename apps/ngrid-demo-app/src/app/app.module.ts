import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { Angulartics2Module } from 'angulartics2';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { NxModule } from '@nrwl/nx';

import { SharedModule } from '@pebula/apps/ngrid/shared';

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
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule.forRoot(
      [
        { path: '', loadChildren: () => import('@pebula/apps/ngrid/demos').then(m => m.DemosModule) },
        { path: 'concepts', loadChildren: () => import('@pebula/apps/ngrid/concepts').then(m => m.ConceptsModule) },
        { path: 'features', loadChildren: () => import('@pebula/apps/ngrid/features').then(m => m.FeaturesModule) },
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

