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
        { path: '', loadChildren: '@pebula/apps/ngrid/demos#DemosModule' },
        { path: 'concepts', loadChildren: '@pebula/apps/ngrid/concepts#ConceptsModule' },
        { path: 'features', loadChildren: '@pebula/apps/ngrid/features#FeaturesModule' },
        { path: 'extensions', loadChildren: '@pebula/apps/ngrid/extensions#ExtensionsModule' },
        { path: 'stories', loadChildren: '@pebula/apps/ngrid/stories#StoriesModule' },
      ],
      {
        useHash: true,
        preloadingStrategy: PreloadAllModules,
      },
    ),
    Angulartics2Module.forRoot(),
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

