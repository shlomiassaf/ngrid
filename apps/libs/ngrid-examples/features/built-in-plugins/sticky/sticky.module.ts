import { NgModule } from '@angular/core';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { StickyExample } from './sticky.component';
import { RowColumnDefinitionsExample } from './row-column-definitions.component';
import { RowWithDirectivesExample } from './row-with-directives.component';
import { RowMultiHeaderExample } from './row-multi-header.component';
import { ColumnWithDirectivesExample } from './column-with-directives.component';
import { ColumnMixSetupExample } from './column-mix-setup.component';

@NgModule({
  declarations: [ StickyExample, RowColumnDefinitionsExample, RowWithDirectivesExample, RowMultiHeaderExample, ColumnWithDirectivesExample, ColumnMixSetupExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule, PblNgridStickyModule,
  ],
  exports: [ StickyExample, RowColumnDefinitionsExample, RowWithDirectivesExample, RowMultiHeaderExample, ColumnWithDirectivesExample, ColumnMixSetupExample ],
  entryComponents: [ StickyExample, RowColumnDefinitionsExample, RowWithDirectivesExample, RowMultiHeaderExample, ColumnWithDirectivesExample, ColumnMixSetupExample ],
})
export class StickyExampleModule { }
