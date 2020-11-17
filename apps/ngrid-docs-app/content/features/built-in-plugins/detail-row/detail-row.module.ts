import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';
import { PblNgridMatSortModule } from '@pebula/ngrid-material/sort';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { DetailRowExample } from './detail-row.component';
import { CustomParentExample } from './custom-parent.component';
import { SingleAndExcludeModeExample } from './single-and-exclude-mode.component';
import { PredicateExample } from './predicate.component';
import { MultiPageExample } from './multi-page.component';
import { DetailRowVirtualScrollExample } from './detail-row-virtual-scroll.component';

@NgModule({
  declarations: [ DetailRowExample, CustomParentExample, SingleAndExcludeModeExample, PredicateExample, MultiPageExample, DetailRowVirtualScrollExample ],
  imports: [
    CommonModule,
    MatRippleModule, MatCheckboxModule, MatRadioModule, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridDetailRowModule, PblNgridBlockUiModule, PblNgridPaginatorModule, PblNgridMatSortModule,
  ],
  exports: [ DetailRowExample, CustomParentExample, SingleAndExcludeModeExample, PredicateExample, MultiPageExample, DetailRowVirtualScrollExample ],
})
@BindNgModule(DetailRowExample, CustomParentExample, SingleAndExcludeModeExample, PredicateExample, MultiPageExample, DetailRowVirtualScrollExample)
export class DetailRowExampleModule { }
