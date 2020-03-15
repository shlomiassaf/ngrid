import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridMatCheckboxSelectionDirective } from './checkbox-plugin.directive';
import { PblNgridCheckboxComponent } from './table-checkbox.component';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, PblNgridModule ],
  declarations: [ PblNgridMatCheckboxSelectionDirective, PblNgridCheckboxComponent ],
  exports: [ PblNgridMatCheckboxSelectionDirective, PblNgridCheckboxComponent ],
  // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
  entryComponents: [ PblNgridCheckboxComponent ]
})
export class PblNgridCheckboxModule { }
