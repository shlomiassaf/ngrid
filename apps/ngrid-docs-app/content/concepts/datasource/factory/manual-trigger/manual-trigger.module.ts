import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
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
