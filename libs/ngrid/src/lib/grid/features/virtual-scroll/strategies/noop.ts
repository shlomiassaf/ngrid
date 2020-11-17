import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';

const noop = function(nv?: any, nv1?: any) { };

export class NoVirtualScrollStrategy implements VirtualScrollStrategy {
  scrolledIndexChange: any;
  attach: (viewport: CdkVirtualScrollViewport) => void = noop;
  detach: () => void = noop;
  onContentScrolled: () => void = noop;
  onDataLengthChanged: () => void = noop;
  onContentRendered: () => void = noop;
  onRenderedOffsetChanged: () => void = noop;
  scrollToIndex: (index: number, behavior: ScrollBehavior) => void = noop;
}
