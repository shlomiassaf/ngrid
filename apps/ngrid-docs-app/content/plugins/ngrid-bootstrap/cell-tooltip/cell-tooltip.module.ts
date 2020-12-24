import { NgModule } from '@angular/core';
import { PblNgridBsCellTooltipModule } from '@pebula/ngrid-bootstrap/cell-tooltip';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { PblNgridDocsAppBootstrapStylesModule } from '../bootstrap-styles.module';
import { CellTooltipExample } from './cell-tooltip.component';

@NgModule({
  declarations: [ CellTooltipExample ],
  imports: [
    PblNgridDocsAppBootstrapStylesModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridBsCellTooltipModule,
  ],
  exports: [ CellTooltipExample ],
})
@BindNgModule(CellTooltipExample)
export class CellTooltipExampleModule { }
