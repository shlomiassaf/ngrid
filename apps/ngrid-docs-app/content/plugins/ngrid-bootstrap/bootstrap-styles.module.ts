import { NgModule, ComponentFactoryResolver, Injector, INJECTOR, Inject } from '@angular/core';
import { PblNgridDocsAppBootstrapStyleLoaderComponent } from './_styles/bootstrap-style-loader.component';

const CSS_LOAD_MARK = Symbol('CSS Load Mark!');

@NgModule({})
export class PblNgridDocsAppBootstrapStylesModule {
  constructor(cfr: ComponentFactoryResolver, @Inject(INJECTOR) injector: Injector) {
    if (!(CSS_LOAD_MARK in PblNgridDocsAppBootstrapStylesModule)) {
      PblNgridDocsAppBootstrapStylesModule[CSS_LOAD_MARK] = true;
      const factory = cfr.resolveComponentFactory(PblNgridDocsAppBootstrapStyleLoaderComponent);
      factory.create(injector);
    }
  }
}
