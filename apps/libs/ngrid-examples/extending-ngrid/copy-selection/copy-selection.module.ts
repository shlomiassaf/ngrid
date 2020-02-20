import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridClipboardPluginModule } from '@pebula/ngrid/clipboard';

import { BindNgModule } from '@pebula/apps/shared';
import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { CopySelectionExample } from './copy-selection.component';

@NgModule({
  declarations: [ CopySelectionExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridClipboardPluginModule,
  ],
  exports: [ CopySelectionExample ],
})
@BindNgModule(CopySelectionExample)
export class CopySelectionExampleModule { }
