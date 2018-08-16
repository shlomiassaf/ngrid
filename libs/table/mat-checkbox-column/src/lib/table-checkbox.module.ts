import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SgTableModule } from '@sac/table';
import { SgTableMatCheckboxSelectionDirective } from './checkbox-plugin.directive';
import { SgTableCheckboxComponent } from './table-checkbox.component';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, SgTableModule ],
  declarations: [ SgTableMatCheckboxSelectionDirective, SgTableCheckboxComponent ],
  exports: [ SgTableMatCheckboxSelectionDirective, SgTableCheckboxComponent ],
  entryComponents: [ SgTableCheckboxComponent ]
})
export class SgTableCheckboxModule { }
