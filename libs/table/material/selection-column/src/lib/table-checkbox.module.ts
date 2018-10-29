import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NegTableModule } from '@neg/table';
import { NegTableMatCheckboxSelectionDirective } from './checkbox-plugin.directive';
import { NegTableCheckboxComponent } from './table-checkbox.component';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, NegTableModule ],
  declarations: [ NegTableMatCheckboxSelectionDirective, NegTableCheckboxComponent ],
  exports: [ NegTableMatCheckboxSelectionDirective, NegTableCheckboxComponent ],
  entryComponents: [ NegTableCheckboxComponent ]
})
export class NegTableCheckboxModule { }
