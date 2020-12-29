import { NgModule, ComponentFactoryResolver, Injector, INJECTOR, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { PblNgridDocsAppBootstrapStyleLoaderComponent } from './_styles/bootstrap-style-loader.component';
import { CommonGridTemplatesComponent } from './common-grid-templates';
import { PblNgridBsHeaderTitlePipe } from './header-label.pipe';

const CSS_LOAD_MARK = Symbol('CSS Load Mark!');

@NgModule({
  declarations: [
    CommonGridTemplatesComponent,
    PblNgridBsHeaderTitlePipe,
  ],
  imports: [
    CommonModule,
    NgbRatingModule,
    PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent }]),
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridBlockUiModule,
  ],
  providers: [ PblNgridRegistryService ],
})
export class PblNgridDocsAppBootstrapStylesModule {
  constructor(cfr: ComponentFactoryResolver,
              @Inject(INJECTOR) injector: Injector) {
    if (!(CSS_LOAD_MARK in PblNgridDocsAppBootstrapStylesModule)) {
      PblNgridDocsAppBootstrapStylesModule[CSS_LOAD_MARK] = true;
      const factory = cfr.resolveComponentFactory(PblNgridDocsAppBootstrapStyleLoaderComponent);
      factory.create(injector);
    }
  }
}
