import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '../../../example-common';
import { DatasourceIntroductionSimpleModelExample } from './simple-model.component';

@NgModule({
  declarations: [ DatasourceIntroductionSimpleModelExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ DatasourceIntroductionSimpleModelExample ],
  entryComponents: [ DatasourceIntroductionSimpleModelExample ],
})
export class DatasourceIntroductionSimpleModelExampleModule { }
