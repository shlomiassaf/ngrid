import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblTableModule } from '@pebula/table';
import { PblTableMatCheckboxSelectionDirective } from './checkbox-plugin.directive';
import { PblTableCheckboxComponent } from './table-checkbox.component';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, PblTableModule ],
  declarations: [ PblTableMatCheckboxSelectionDirective, PblTableCheckboxComponent ],
  exports: [ PblTableMatCheckboxSelectionDirective, PblTableCheckboxComponent ],
  entryComponents: [ PblTableCheckboxComponent ]
})
export class PblTableCheckboxModule { }
