import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSortHeader } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';

import { NegTableModule } from '@neg/table';
import { NegTableMatSortDirective } from './mat-sort.directive';

@NgModule({
  imports: [ CommonModule, MatButtonModule, MatSortModule, NegTableModule ],
  declarations: [ NegTableMatSortDirective ],
  exports: [ NegTableMatSortDirective, MatSortModule ],
  entryComponents: [ MatSortHeader ]
})
export class NegTableMatSortModule { }
