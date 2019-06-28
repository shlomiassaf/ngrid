import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '../../../example-common';
import { ManualDatasourceTriggerExample } from './manual-trigger.component';

@NgModule({
  declarations: [ ManualDatasourceTriggerExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ManualDatasourceTriggerExample ],
  entryComponents: [ ManualDatasourceTriggerExample ],
})
export class ManualDatasourceTriggerExampleModule { }
