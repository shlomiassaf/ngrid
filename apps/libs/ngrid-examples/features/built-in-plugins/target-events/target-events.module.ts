import { NgModule } from '@angular/core';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';

import { ExampleCommonModule } from '@pebula/apps/ngrid-examples/example-common';
import { TargetEventsExample } from './target-events.component';
import { FocusAndRangeSelectionExample } from './focus-and-range-selection.component';
import { EnterAndLeaveEventsExample } from './enter-and-leave-events.component';

@NgModule({
  declarations: [ TargetEventsExample, FocusAndRangeSelectionExample, EnterAndLeaveEventsExample ],
  imports: [
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridTargetEventsModule,
  ],
  exports: [ TargetEventsExample, FocusAndRangeSelectionExample, EnterAndLeaveEventsExample ],
  entryComponents: [ TargetEventsExample, FocusAndRangeSelectionExample, EnterAndLeaveEventsExample ],
})
export class TargetEventsExampleModule { }
