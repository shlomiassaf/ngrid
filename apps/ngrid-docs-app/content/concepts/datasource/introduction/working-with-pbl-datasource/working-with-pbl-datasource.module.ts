import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { WorkingWithPblDataSourceExample } from './working-with-pbl-datasource.component';

@NgModule({
  declarations: [ WorkingWithPblDataSourceExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ WorkingWithPblDataSourceExample ],
})
@BindNgModule(WorkingWithPblDataSourceExample)
export class WorkingWithPblDataSourceExampleModule { }
