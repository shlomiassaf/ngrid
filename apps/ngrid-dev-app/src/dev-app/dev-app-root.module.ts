import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ROUTES } from '../routes';
import { DevAppRootComponent } from './dev-app-root.component';
import { DevAppHostModule } from './dev-app-host/dev-app-host.module';
import { DEV_APP_ROOT_ROUTES } from './dev-app-root.routes';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DevAppHostModule,
    RouterModule.forRoot([...DEV_APP_ROOT_ROUTES, ...ROUTES]),
  ],
  declarations: [ DevAppRootComponent ],
  providers: [ ],
  bootstrap: [ DevAppRootComponent ],
})
export class DevAppRootModule {
}
