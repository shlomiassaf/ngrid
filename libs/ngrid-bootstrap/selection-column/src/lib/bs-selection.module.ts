import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNgridModule, ngridPlugin } from '@pebula/ngrid';
import { PblNgridBsSelectionPlugin, PLUGIN_KEY } from './bs-selection-plugin.directive';
import { PblNgridBsSelectionComponent } from './bs-selection.component';

@NgModule({
    imports: [CommonModule, MatCheckboxModule, PblNgridModule],
    declarations: [PblNgridBsSelectionPlugin, PblNgridBsSelectionComponent],
    exports: [PblNgridBsSelectionPlugin, PblNgridBsSelectionComponent]
})
export class PblNgridBsSelectionModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridBsSelectionPlugin);
}
