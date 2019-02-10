import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblTableModule } from '@pebula/table';
import { PblTableTransposePluginDirective } from './transpose-plugin.directive';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, PblTableModule ],
  declarations: [ PblTableTransposePluginDirective ],
  exports: [ PblTableTransposePluginDirective ],
})
export class PblTableTransposeModule { }
