import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNgridModule, ngridPlugin } from '@pebula/ngrid';
import { PblNgridMatCheckboxSelectionDirective, PLUGIN_KEY } from './checkbox-plugin.directive';
import { PblNgridCheckboxComponent } from './table-checkbox.component';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, PblNgridModule ],
  declarations: [ PblNgridMatCheckboxSelectionDirective, PblNgridCheckboxComponent ],
  exports: [ PblNgridMatCheckboxSelectionDirective, PblNgridCheckboxComponent ],
  // TODO: remove when ViewEngine is no longer supported by angular (V11 ???)
  entryComponents: [ PblNgridCheckboxComponent ]
})
export class PblNgridCheckboxModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridMatCheckboxSelectionDirective);
}
