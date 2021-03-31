import { filter, first } from 'rxjs/operators';
import { APP_BOOTSTRAP_LISTENER, ApplicationRef, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { UniversalInterceptor } from './ssr';
import { AppModule, REQ_KEY } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    FlexLayoutServerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: (appRef: ApplicationRef, transferState: TransferState, request: Request) => () =>
        appRef.isStable
          .pipe(
            filter(stable => stable),
            first()
          )
          .subscribe(() => {
            transferState.set<any>(REQ_KEY, {
              hostname: request.hostname,
              originalUrl: request.originalUrl,
              referer: request.get('referer')
            });
          }),
      multi: true,
      deps: [ApplicationRef, TransferState, REQUEST]
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
