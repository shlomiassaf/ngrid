import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule  } from '@angular/material/form-field';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { MultiColumnFilterExample } from './multi-column-filter.component';

@NgModule({
  declarations: [ MultiColumnFilterExample ],
  imports: [
    CommonModule,
    MatIconModule, MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ MultiColumnFilterExample ],
})
@BindNgModule(MultiColumnFilterExample)
export class MultiColumnFilterExampleModule { }
