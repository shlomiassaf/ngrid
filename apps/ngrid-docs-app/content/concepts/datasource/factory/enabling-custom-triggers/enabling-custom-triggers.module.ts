import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { EnablingCustomTriggersExample } from './enabling-custom-triggers.component';

@NgModule({
  declarations: [ EnablingCustomTriggersExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridPaginatorModule,
  ],
  exports: [ EnablingCustomTriggersExample ],
})
@BindNgModule(EnablingCustomTriggersExample)
export class EnablingCustomTriggersExampleModule { }

