import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { ManualDatasourceTriggerExample } from './manual-trigger.component';

@NgModule({
  declarations: [ ManualDatasourceTriggerExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ ManualDatasourceTriggerExample ],
})
@BindNgModule(ManualDatasourceTriggerExample)
export class ManualDatasourceTriggerExampleModule { }
