import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { TransposeExample } from './transpose.component';
import { OriginalTemplatesExample } from './original-templates.component';
import { WithColumnStylesExample } from './with-column-styles.component';

@NgModule({
  declarations: [ TransposeExample, OriginalTemplatesExample, WithColumnStylesExample ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridTransposeModule, PblNgridBlockUiModule,
  ],
  exports: [ TransposeExample, OriginalTemplatesExample, WithColumnStylesExample ],
})
@BindNgModule(TransposeExample, OriginalTemplatesExample, WithColumnStylesExample)
export class TransposeExampleModule { }
