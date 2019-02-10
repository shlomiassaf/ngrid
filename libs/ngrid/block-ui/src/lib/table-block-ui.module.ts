import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdkTableModule } from '@angular/cdk/table';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiDefDirective } from './block-ui/directives';
import { PblNgridBlockUiPluginDirective } from './block-ui/block-ui-plugin';

@NgModule({
  imports: [ CommonModule, CdkTableModule, PblNgridModule ],
  declarations: [ PblNgridBlockUiDefDirective, PblNgridBlockUiPluginDirective ],
  exports: [  PblNgridBlockUiDefDirective, PblNgridBlockUiPluginDirective  ]
})
export class PblNgridBlockUiModule { }
