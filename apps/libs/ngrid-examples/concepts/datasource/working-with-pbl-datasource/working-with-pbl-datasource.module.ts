import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { WorkingWithPblDataSourceExample } from './working-with-pbl-datasource.component';

@NgModule({
  declarations: [ WorkingWithPblDataSourceExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ WorkingWithPblDataSourceExample ],
  entryComponents: [ WorkingWithPblDataSourceExample ],
})
export class WorkingWithPblDataSourceExampleModule { }
