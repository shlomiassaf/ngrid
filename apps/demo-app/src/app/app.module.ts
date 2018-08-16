import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { NxModule } from '@nrwl/nx';

import { SharedModule } from '@sac/demo-apps/shared';
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
    MatSidenavModule,
    MatListModule,
    // `path` of ExampleGroup must match the group id!
    RouterModule.forRoot(
      [
        { path: 'table', loadChildren: '@sac/demo-apps/table-demo#TableDemoModule' }
      ],
      {
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: 'enabled',
      }
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
