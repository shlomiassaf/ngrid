import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';
import { MatButtonModule } from '@angular/material/button';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { SwitchingColumnDefinitionsExample } from './switching-column-definitions.component';

@NgModule({
  declarations: [ SwitchingColumnDefinitionsExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    MatButtonModule,
    PblNgridModule,
  ],
  exports: [ SwitchingColumnDefinitionsExample ],
})
@BindNgModule(SwitchingColumnDefinitionsExample)
export class SwitchingColumnDefinitionsExampleModule { }
