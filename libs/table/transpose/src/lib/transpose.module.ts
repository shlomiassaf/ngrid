import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SgTableModule } from '@sac/table';
import { SgTableTransposePluginDirective } from './transpose-plugin.directive';

@NgModule({
  imports: [ CommonModule, MatCheckboxModule, SgTableModule ],
  declarations: [ SgTableTransposePluginDirective ],
  exports: [ SgTableTransposePluginDirective ],
})
export class SgTableTransposeModule { }
