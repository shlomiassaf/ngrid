import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { DatasourceIntroductionSimpleModelExample } from './simple-model.component';

@NgModule({
  declarations: [ DatasourceIntroductionSimpleModelExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ DatasourceIntroductionSimpleModelExample ],
})
@BindNgModule(DatasourceIntroductionSimpleModelExample)
export class DatasourceIntroductionSimpleModelExampleModule { }
