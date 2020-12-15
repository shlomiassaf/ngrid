import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { PblDataSource, unrx } from '@pebula/ngrid/core';

import { PblNgridInternalExtensionApi, PblNgridExtensionApi } from '../../../../../ext/grid-ext-api';
import { PblCdkVirtualScrollViewportComponent } from '../../virtual-scroll-viewport.component';
import { PblNgridVirtualScrollStrategy } from '../types';
import { Sizer } from './sizer';

declare module '../types' {
  interface PblNgridVirtualScrollStrategyMap {
    vScrollDynamic: PblNgridDynamicVirtualScrollStrategy;
  }
}

export class PblNgridDynamicVirtualScrollStrategy implements PblNgridVirtualScrollStrategy<'vScrollDynamic'> {

  readonly type: 'vScrollDynamic' = 'vScrollDynamic';

  protected _scrolledIndexChange = new Subject<number>();

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  scrolledIndexChange: Observable<number> = this._scrolledIndexChange.pipe(distinctUntilChanged());

  /** The attached viewport. */
  protected _viewport: PblCdkVirtualScrollViewportComponent | null = null;

  /** The minimum amount of buffer rendered beyond the viewport (in pixels). */
  protected _minBufferPx: number;

  /** The number of buffer items to render beyond the edge of the viewport (in pixels). */
  protected _maxBufferPx: number;

  protected _lastRenderedContentOffset: number;
  protected _lastExcessHeight = 0;

  protected sizer: Sizer;

  private extApi: PblNgridInternalExtensionApi;

  /**
   * @param itemSize The size of the items in the virtually scrolling list.
   * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
   * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
   */
  constructor(itemSize: number, minBufferPx: number, maxBufferPx: number) {
    this.sizer = new Sizer();
    this.sizer.itemSize = itemSize;
    this._minBufferPx = minBufferPx;
    this._maxBufferPx = maxBufferPx;
  }

  /**
   * Update the item size and buffer size.
   * @param itemSize The size of the items in the virtually scrolling list.
   * @param minBufferPx The minimum amount of buffer (in pixels) before needing to render more
   * @param maxBufferPx The amount of buffer (in pixels) to render when rendering more.
   */
  updateItemAndBufferSize(itemSize: number, minBufferPx: number, maxBufferPx: number) {
    // if (maxBufferPx < minBufferPx && (typeof ngDevMode === 'undefined' || ngDevMode)) {
    //   throw Error('CDK virtual scroll: maxBufferPx must be greater than or equal to minBufferPx');
    // }
    this.sizer.itemSize = itemSize;
    this._minBufferPx = minBufferPx;
    this._maxBufferPx = maxBufferPx;
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  attachExtApi(extApi: PblNgridExtensionApi): void {
    this.extApi = extApi as PblNgridInternalExtensionApi;
    this.extApi.events
      .subscribe( event => {
        if (event.kind === 'onDataSource') {
          this.onDatasource(event.curr, event.prev);
        }
      });
    if (this.extApi.grid.ds) {
      this.onDatasource(this.extApi.grid.ds);
    }
  }

  attach(viewport: PblCdkVirtualScrollViewportComponent): void {
    if (!this.extApi) {
      throw new Error('Invalid use of attach, you must first attach `PblNgridExtensionApi`');
    }

    this._viewport = viewport;
    this._updateSizeAndRange();
  }

  detach(): void {
    this._scrolledIndexChange.complete();
    this._viewport = null;
  }

  onContentScrolled() {
    this._updateRenderedRange();
  }

  onDataLengthChanged() {
    this.sizer.itemsLength = this._viewport.getDataLength();
    this._updateSizeAndRange();
  }

  onContentRendered() {
    this._checkRenderedContentSize();
  }

  onRenderedOffsetChanged() {
    if (this._viewport) {
      this._lastRenderedContentOffset = this._viewport.getOffsetToRenderedContentStart();
    }
  }

  /**
   * Scroll to the offset for the given index.
   * @param index The index of the element to scroll to.
   * @param behavior The ScrollBehavior to use when scrolling.
   */
  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (this._viewport) {
      this._viewport.scrollToOffset(this.sizer.getSizeBefore(index), behavior);
    }
  }

  protected onDatasource(curr: PblDataSource, prev?: PblDataSource) {
    if (prev) {
      unrx.kill(this, prev);
    }
    if (curr) {
      curr.onSourceChanging
        .pipe(unrx(this, curr))
        .subscribe(() => {
          this.sizer.clear();
        });
    }
  }

  protected _updateSizeAndRange() {
    this._updateTotalContentSize();
    this._updateRenderedRange(true);
  }

  /** Update the viewport's total content size. */
  protected _updateTotalContentSize() {
    if (!this._viewport) {
      return;
    }

    for (const row of this.extApi.rowsApi.dataRows()) {
      if (row.context) {
        this.sizer.setSize(row.context.dsIndex, row.height);
      }
    }

    this._viewport.setTotalContentSize(this.sizer.getTotalContentSize());
  }

  protected _checkRenderedContentSize() {
    this._updateTotalContentSize();
  }

  /** Update the viewport's rendered range. */
  protected _updateRenderedRange(skipSizeSync?: boolean) {
    if (!this._viewport) {
      return;
    }

    const renderedRange = this._viewport.getRenderedRange();

    // if (!skipSizeSync) {
    //   for (let i = renderedRange.start; i <= renderedRange.end; i++) {
    //     this.sizer.setSize(i, this.extApi.rowsApi.findDataRowByDsIndex(i)?.height ?? this.sizer.itemSize);
    //   }
    // }

    const newRange = {start: renderedRange.start, end: renderedRange.end};
    const viewportSize = this._viewport.getViewportSize();
    const dataLength = this._viewport.getDataLength();
    let scrollOffset = this._viewport.measureScrollOffset();
    let firstVisibleIndex = this.sizer.findRenderItemAtOffset(scrollOffset);
    let excessHeight = 0;

    // When user scrolls to the top, rows change context, sometimes new rows are added etc.
    // With dynamic size, rows with additional size payload will cause the scroll offset to change because they are added
    // before the visible rows, this will throw the entire scroll out of sync.
    // To solve this we use a 2 step process.
    // 1) For each `_updateRenderRange` cycle of scrolling to the TOP, we sum up excess all height and save them.
    // 2) If we had excess height it will create a scroll change which will lead us back here. Now we check if we
    // have previously saved access height, if so we reduce the scroll offset back to what it was supposed to be, like adding the height did not effect the offset.
    // Since the first step causes a scroll offset flicker, the grid will jump forward and show rows not in the range we want, if we just move back on the 2nd tick
    // it will cause a flicker in the grid. To prevent it we compensate by pushing in the 1st tick, the rendered content offset forward to match the offset change.
    // In the second tick we revet it and restore the offset.
    if (this._lastExcessHeight) {
      const lastExcessHeight = this._lastExcessHeight;
      this._lastExcessHeight = 0;
      this._viewport.setRenderedContentOffset(this._lastRenderedContentOffset - lastExcessHeight);
      this._viewport.scrollToOffset(scrollOffset - lastExcessHeight);
      return;
    }

    // If user scrolls to the bottom of the list and data changes to a smaller list
    if (newRange.end > dataLength) {
      // We have to recalculate the first visible index based on new data length and viewport size.
      let spaceToFill = viewportSize;
      let expandEnd = firstVisibleIndex;
      while (spaceToFill > 0) {
        spaceToFill -= this.sizer.getSizeForItem(++expandEnd);
      }
      const maxVisibleItems = expandEnd - firstVisibleIndex;
      const newVisibleIndex = Math.max(0, Math.min(firstVisibleIndex, dataLength - maxVisibleItems));

      // If first visible index changed we must update scroll offset to handle start/end buffers
      // Current range must also be adjusted to cover the new position (bottom of new list).
      if (firstVisibleIndex !== newVisibleIndex) {
        firstVisibleIndex = newVisibleIndex;
        scrollOffset =  this.sizer.getSizeBefore(firstVisibleIndex);
        newRange.start = firstVisibleIndex;
      }

      newRange.end = Math.max(0, Math.min(dataLength, newRange.start + maxVisibleItems));
    }

    let contentOffset = this.sizer.getSizeBefore(newRange.start);
    const currentStartBuffer = scrollOffset - contentOffset;

    if (currentStartBuffer < this._minBufferPx && newRange.start !== 0) {
      let spaceToFill = this._maxBufferPx - currentStartBuffer;
      if (spaceToFill < 0) {
        spaceToFill = Math.abs(spaceToFill) + this._maxBufferPx;
      }
      let expandStart = newRange.start;
      while (spaceToFill > 0) {
        const newSize = this.sizer.getSizeForItem(--expandStart);
        spaceToFill -= newSize;
        excessHeight += newSize - this.sizer.itemSize;
      }

      expandStart = Math.max(0, expandStart);
      if (expandStart !== newRange.start) {
        newRange.start = expandStart;
        contentOffset = this.sizer.getSizeBefore(expandStart);
      }

      spaceToFill = viewportSize + this._minBufferPx;
      let expandEnd = firstVisibleIndex;
      while (spaceToFill > 0) {
        spaceToFill -= this.sizer.getSizeForItem(++expandEnd);
      }
      newRange.end = Math.min(dataLength, expandEnd);
    } else {
      const renderDataEnd = contentOffset + this.sizer.getSizeForRange(newRange.start, newRange.end);
      const currentEndBuffer = renderDataEnd - (scrollOffset + viewportSize);
      if (currentEndBuffer < this._minBufferPx && newRange.end !== dataLength) {
        let spaceToFill = this._maxBufferPx - currentEndBuffer;
        if (spaceToFill < 0) {
          spaceToFill = Math.abs(spaceToFill) + this._maxBufferPx;
        }
        let expandEnd = newRange.end;
        while (spaceToFill > 0) {
          spaceToFill -= this.sizer.getSizeForItem(++expandEnd);
        }
        if (expandEnd > 0) {
          newRange.end = Math.min(dataLength, expandEnd);

          spaceToFill = this._minBufferPx;
          let expandStart = firstVisibleIndex;
          while (spaceToFill > 0) {
            spaceToFill -= this.sizer.getSizeForItem(--expandStart);
          }

          expandStart = Math.max(0, expandStart);
          if (expandStart !== newRange.start) {
            newRange.start = expandStart;
            contentOffset = this.sizer.getSizeBefore(expandStart);
          }
        }
      }
    }

     this._lastExcessHeight = excessHeight;
    this._viewport.setRenderedRange(newRange);
    this._viewport.setRenderedContentOffset(contentOffset + excessHeight);
    this._scrolledIndexChange.next(Math.floor(firstVisibleIndex));
  }

}
