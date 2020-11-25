import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';
import { PblNgridExtensionApi } from '../../../../../ext/grid-ext-api';
import { PblCdkVirtualScrollViewportComponent } from '../../virtual-scroll-viewport.component';
import { PblNgridVirtualScrollStrategy } from '../types';

declare module '../types' {
  interface PblNgridVirtualScrollStrategyMap {
    vScrollFixed: PblNgridFixedSizeVirtualScrollStrategy;
  }
}

export class PblNgridFixedSizeVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy implements PblNgridVirtualScrollStrategy<'vScrollFixed'> {

  get type() { return 'vScrollFixed' as const; }

  private viewport: PblCdkVirtualScrollViewportComponent;
  protected extApi: PblNgridExtensionApi;

  constructor(private itemSize: number, minBufferPx: number, maxBufferPx: number) {
    super(itemSize, minBufferPx, maxBufferPx);
  }

  attachExtApi(extApi: PblNgridExtensionApi): void {
    this.extApi = extApi;
  }

  attach(viewport: PblCdkVirtualScrollViewportComponent): void {
    if (!this.extApi) {
      throw new Error('Invalid use of attach, you must first attach `PblNgridExtensionApi`');
    }
    super.attach(this.viewport = viewport);
  }


  onContentScrolled() {
    // https://github.com/shlomiassaf/ngrid/issues/11

    // This is a workaround an issue with FixedSizeVirtualScrollStrategy
    // When:
    //    - The rendered data is changed so the data length is now LOWER then the current range (end - start)
    //    - The rendering direction is towards the top (start > end)
    //
    // For the issue to occur a big gap between the data length and the range length (gap), which does not happen on normal scrolling
    // but only when the data source is replaced (e.g. filtering).
    //
    // In such cases `onDataLengthChanged` is called which will call `_updateRenderedRange` which will calculate a new range
    // that is big, it will give the `start` a new value which creates the big gap.
    // It will then calculate a new "end" and leave the "start" so we have a big gap, larger then the viewport size.
    // After that it will create the new offset which is the itemSize * start, which is a bit lower then the offset but is large and again does not fit the viewport size
    // The scroll change will trigger `onContentScrolled` which will call `_updateRenderedRange` again,
    // with the same outcome, reducing the offset slightly, calling `onContentScrolled` again.
    // It will repeat until reaching the proper offset.
    //
    // The amount of offset reduced each time is approx the size of the buffers. (mix/max Buffer).
    //
    // This strategy is here only because of this error, it will let the initial update run and catch it's subsequent scroll event.
    if (!this.viewport) {
      return;
    }
    let { start, end } = this.viewport.getRenderedRange();
    const rangeLength = end - start;
    const dataLength = this.viewport.getDataLength();
    if (rangeLength < 0 && dataLength < -rangeLength) {
      start = dataLength - end;
      this.viewport.setRenderedRange({ start, end });
      this.viewport.setRenderedContentOffset(this.itemSize * start);
      // this._scrolledIndexChange.next(Math.floor(firstVisibleIndex));
    } else {
      super.onContentScrolled();
    }
  }
}
