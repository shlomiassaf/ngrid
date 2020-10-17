import {
  Directive,
  ElementRef,
  Optional,
  Inject,
  SkipSelf,
} from '@angular/core';
import { CDK_DRAG_HANDLE, CdkDragHandle, CDK_DRAG_PARENT } from '@angular/cdk/drag-drop';

/** Handle that can be used to drag and CdkDrag instance. */
@Directive({
  selector: '[pblDragHandle]',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag-handle'
  },
  providers: [
    {
      provide: CDK_DRAG_HANDLE,
      useExisting: PblDragHandle
    }
  ]
})
export class PblDragHandle extends CdkDragHandle {
  constructor(public element: ElementRef<HTMLElement>,
              @Inject(CDK_DRAG_PARENT) @Optional() @SkipSelf() parentDrag?: any) { super(element, parentDrag); }
}
