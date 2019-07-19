import { NgModule } from '@angular/core';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridCellTooltipModule } from '@pebula/ngrid-material/cell-tooltip';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { CellTooltipExample } from './cell-tooltip.component';
import { CustomSetupExample } from './custom-setup.component';

@NgModule({
  declarations: [ CellTooltipExample, CustomSetupExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridCellTooltipModule,
  ],
  exports: [ CellTooltipExample, CustomSetupExample ],
  entryComponents: [ CellTooltipExample, CustomSetupExample ],
})
export class CellTooltipExampleModule { }
