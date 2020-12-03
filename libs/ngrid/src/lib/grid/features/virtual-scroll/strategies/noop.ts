import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { PblNgridExtensionApi } from '../../../../ext/grid-ext-api';
import { PblNgridVirtualScrollStrategy } from './types';

const noop = function() { };

declare module './types' {
  interface PblNgridVirtualScrollStrategyMap {
    vScrollNone: NoVirtualScrollStrategy;
  }
}

export class NoVirtualScrollStrategy implements PblNgridVirtualScrollStrategy<'vScrollNone'> {
  get type() { return 'vScrollNone' as const; }

  scrolledIndexChange: any;
  attachExtApi: (extApi: PblNgridExtensionApi) => void = noop;
  attach: (viewport: CdkVirtualScrollViewport) => void = noop;
  detach: () => void = noop;
  onContentScrolled: () => void = noop;
  onDataLengthChanged: () => void = noop;
  onContentRendered: () => void = noop;
  onRenderedOffsetChanged: () => void = noop;
  scrollToIndex: (index: number, behavior: ScrollBehavior) => void = noop;
}
