import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { NxModule } from '@nrwl/nx';

import { SharedModule } from '@pebula/apps/table/shared';

import { DemoHomePageComponent } from './demo-home-page/demo-home-page.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoHomePageComponent
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
        { path: '', loadChildren: '@pebula/apps/table/demos#DemosModule' },
        { path: 'concepts', loadChildren: '@pebula/apps/table/concepts#ConceptsModule' },
        { path: 'features', loadChildren: '@pebula/apps/table/features#FeaturesModule' },
        { path: 'stories', loadChildren: '@pebula/apps/table/stories#StoriesModule' },
      ],
      {
        useHash: true,
        preloadingStrategy: PreloadAllModules,
      }
    )
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

