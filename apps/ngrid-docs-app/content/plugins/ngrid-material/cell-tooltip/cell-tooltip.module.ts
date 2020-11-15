import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridCellTooltipModule } from '@pebula/ngrid-material/cell-tooltip';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { CellTooltipExample } from './cell-tooltip.component';
import { CustomSetupExample } from './custom-setup.component';

@NgModule({
  declarations: [ CellTooltipExample, CustomSetupExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridCellTooltipModule,
  ],
  exports: [ CellTooltipExample, CustomSetupExample ],
})
@BindNgModule(CellTooltipExample, CustomSetupExample)
export class CellTooltipExampleModule { }
