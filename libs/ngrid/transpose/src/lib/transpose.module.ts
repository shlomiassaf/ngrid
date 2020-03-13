import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridTransposePluginDirective } from './transpose-plugin.directive';

@NgModule({
  imports: [ CommonModule, PblNgridModule ],
  declarations: [ PblNgridTransposePluginDirective ],
  exports: [ PblNgridTransposePluginDirective ],
})
export class PblNgridTransposeModule { }
