import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNgridModule } from '@pebula/table';
import { PblNgridTransposePluginDirective } from './transpose-plugin.directive';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, PblNgridModule ],
  declarations: [ PblNgridTransposePluginDirective ],
  exports: [ PblNgridTransposePluginDirective ],
})
export class PblNgridTransposeModule { }
