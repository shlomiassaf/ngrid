import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSortHeader } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { SgTableModule } from '@sac/table';
import { SgTableMatSortDirective } from './mat-sort.directive';

@NgModule({
  imports: [ CommonModule, MatButtonModule, MatSortModule, SgTableModule ],
  declarations: [ SgTableMatSortDirective ],
  exports: [ SgTableMatSortDirective, MatSortModule ],
  entryComponents: [ MatSortHeader ]
})
export class SgTableMatSortModule { }
