import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule, ngridPlugin } from '@pebula/ngrid';
import { PblNgridTransposePluginDirective, PLUGIN_KEY } from './transpose-plugin.directive';

@NgModule({
  imports: [ CommonModule, PblNgridModule ],
  declarations: [ PblNgridTransposePluginDirective ],
  exports: [ PblNgridTransposePluginDirective ],
})
export class PblNgridTransposeModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridTransposePluginDirective);
}
