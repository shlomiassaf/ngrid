import { NgModule, Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { Request } from 'express';
import { REQUEST } from '@nguniversal/express-engine/tokens';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {

  constructor(@Optional() @Inject(REQUEST) protected request: Request) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let serverReq: HttpRequest<any> = req;
    if (this.request) {
      let newUrl = `${this.request.protocol}://${this.request.get('host')}`;
      if (!req.url.startsWith('/')) {
        newUrl += '/';
      }
      newUrl += req.url;
      serverReq = req.clone({url: newUrl});
    }
    return next.handle(serverReq);
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UniversalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
