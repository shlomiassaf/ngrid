
import { NgModule, Inject, PLATFORM_ID, Injectable } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { CACHE } from '@ngx-cache/core';
import { BrowserCacheModule } from '@ngx-cache/platform-browser';

import { AppComponent } from './app.component';
import { AppModule, REQ_KEY } from './app.module';
import { MemoryCacheService } from './app.browser.module-fix-ngx-cache-v9-compat';

// TODO: remove workaround once ngx-cache supports v9
@NgModule({
  imports: [
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    BrowserCacheModule.forRoot([
      {
        provide: CACHE,
        useClass: MemoryCacheService,
      }
    ]),
    AppModule
  ],
  providers: [
    {
      provide: REQUEST,
      useFactory: (transferState: TransferState) => transferState.get<any>(REQ_KEY, {}),
      deps: [TransferState]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule {}
