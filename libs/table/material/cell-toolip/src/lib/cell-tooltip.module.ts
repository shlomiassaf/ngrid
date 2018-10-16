import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SgTableModule } from '@sac/table';
import { SgTableCellTooltipDirective } from './cell-tooltip.directive';

@NgModule({
  imports: [ CommonModule, MatTooltipModule, OverlayModule, SgTableModule ],
  declarations: [ SgTableCellTooltipDirective ],
  exports: [ SgTableCellTooltipDirective, MatTooltipModule ],
})
export class SgTableCellTooltipModule { }
