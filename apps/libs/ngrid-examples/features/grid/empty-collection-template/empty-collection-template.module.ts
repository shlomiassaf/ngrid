import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { EmptyCollectionTemplateExample } from './empty-collection-template.component';
import { AsynchronousEmptySetExample } from './asynchronous-empty-set.component';
import { DynamicSetExample } from './dynamic-set.component';

@NgModule({
  declarations: [ EmptyCollectionTemplateExample, AsynchronousEmptySetExample, DynamicSetExample ],
  imports: [
    MatRadioModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ EmptyCollectionTemplateExample, AsynchronousEmptySetExample, DynamicSetExample ],
  entryComponents: [ EmptyCollectionTemplateExample, AsynchronousEmptySetExample, DynamicSetExample ],
})
export class EmptyCollectionTemplateExampleModule { }
