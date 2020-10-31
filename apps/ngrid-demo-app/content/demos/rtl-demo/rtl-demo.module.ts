import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/example-common';
import { RtlDemoExample } from './rtl-demo.component';
import { BidiModule } from '@angular/cdk/bidi';
import { ComplexDemo1ExampleModule } from '../complex-demo1/complex-demo1.module';

@NgModule({
  declarations: [ RtlDemoExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
    BidiModule,
    ComplexDemo1ExampleModule
  ],
  exports: [ RtlDemoExample ]
})
@BindNgModule(RtlDemoExample)
export class RtlDemoExampleModule { }
