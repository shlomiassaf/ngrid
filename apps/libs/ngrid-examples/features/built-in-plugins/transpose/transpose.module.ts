import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { TransposeExample } from './transpose.component';
import { OriginalTemplatesExample } from './original-templates.component';
import { WithColumnStylesExample } from './with-column-styles.component';

@NgModule({
  declarations: [ TransposeExample, OriginalTemplatesExample, WithColumnStylesExample ],
  imports: [
    MatCheckboxModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridTransposeModule, PblNgridBlockUiModule,
  ],
  exports: [ TransposeExample, OriginalTemplatesExample, WithColumnStylesExample ],
  entryComponents: [ TransposeExample, OriginalTemplatesExample, WithColumnStylesExample ],
})
export class TransposeExampleModule { }
