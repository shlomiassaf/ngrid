import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule, PblNgridRegistryService } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { GlobalTemplatesExample } from './global-templates.component';
import { CommonGridTemplatesComponent } from './common-grid-templates.component';

@NgModule({
  declarations: [ CommonGridTemplatesComponent, GlobalTemplatesExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent } ]),
  ],
  providers: [ PblNgridRegistryService],
  exports: [ GlobalTemplatesExample ],
})
@BindNgModule(GlobalTemplatesExample)
export class GlobalTemplatesExampleModule { }
