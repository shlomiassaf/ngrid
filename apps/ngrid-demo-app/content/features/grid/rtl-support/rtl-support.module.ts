import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { RtlSupportExample } from './rtl-support.component';
import { ApplicationLevelRtlExample } from './application-level-rtl.component';

@NgModule({
  declarations: [ RtlSupportExample, ApplicationLevelRtlExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ RtlSupportExample, ApplicationLevelRtlExample ],
})
@BindNgModule(RtlSupportExample, ApplicationLevelRtlExample)
export class RtlSupportExampleModule { }
