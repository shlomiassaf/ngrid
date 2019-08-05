import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { DetailRowExample } from './detail-row.component';
import { CustomParentExample } from './custom-parent.component';
import { SingleAndExcludeModeExample } from './single-and-exclude-mode.component';
import { PredicateExample } from './predicate.component';

@NgModule({
  declarations: [ DetailRowExample, CustomParentExample, SingleAndExcludeModeExample, PredicateExample ],
  imports: [
    CommonModule,
    MatRippleModule, MatCheckboxModule, MatRadioModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridDetailRowModule, PblNgridBlockUiModule,
  ],
  exports: [ DetailRowExample, CustomParentExample, SingleAndExcludeModeExample, PredicateExample ],
  entryComponents: [ DetailRowExample, CustomParentExample, SingleAndExcludeModeExample, PredicateExample ],
})
@BindNgModule(DetailRowExample, CustomParentExample, SingleAndExcludeModeExample, PredicateExample)
export class DetailRowExampleModule { }
