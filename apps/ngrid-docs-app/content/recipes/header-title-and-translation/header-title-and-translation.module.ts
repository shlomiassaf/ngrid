import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';

import { BindNgModule } from '@pebula/apps/docs-app-lib';
import { ExampleCommonModule } from '@pebula/apps/docs-app-lib/example-common.module';
import { HeaderTitleAndTranslationExample } from './header-title-and-translation.component';
import { HeaderToTitlePipe } from './header-to-title.pipe';

@NgModule({
  declarations: [ HeaderToTitlePipe, HeaderTitleAndTranslationExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule,
  ],
  exports: [ HeaderTitleAndTranslationExample ],
})
@BindNgModule(HeaderTitleAndTranslationExample)
export class HeaderTitleAndTranslationExampleModule { }
