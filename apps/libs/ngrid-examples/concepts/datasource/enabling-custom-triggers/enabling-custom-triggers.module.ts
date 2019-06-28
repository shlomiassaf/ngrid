import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridPaginatorModule } from '@pebula/ngrid-material/paginator';

import { ExampleCommonModule } from '../../../example-common';
import { EnablingCustomTriggersExample } from './enabling-custom-triggers.component';

@NgModule({
  declarations: [ EnablingCustomTriggersExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
    PblNgridPaginatorModule,
  ],
  exports: [ EnablingCustomTriggersExample ],
  entryComponents: [ EnablingCustomTriggersExample ],
})
export class EnablingCustomTriggersExampleModule { }
