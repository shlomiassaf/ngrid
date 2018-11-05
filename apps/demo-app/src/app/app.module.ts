import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NxModule } from '@nrwl/nx';

import { SharedModule } from '@neg/demo-apps/shared';
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
    RouterModule.forRoot(
      [
        { path: '', loadChildren: '@neg/demo-apps/demos#DemosModule' },
        { path: 'concepts', loadChildren: '@neg/demo-apps/concepts#ConceptsModule' },
        { path: 'features', loadChildren: '@neg/demo-apps/features#FeaturesModule' },
        { path: 'stories', loadChildren: '@neg/demo-apps/stories#StoriesModule' },
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
