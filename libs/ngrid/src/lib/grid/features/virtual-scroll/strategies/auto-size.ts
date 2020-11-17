import { ListRange } from '@angular/cdk/collections';
import { ItemSizeAverager, AutoSizeVirtualScrollStrategy } from '@angular/cdk-experimental/scrolling';
import { NgeVirtualTableRowInfo } from '../virtual-scroll-for-of';

export class TableItemSizeAverager extends ItemSizeAverager {
  private rowInfo: NgeVirtualTableRowInfo;

  addSample(range: ListRange, size: number) {
    if (this.rowInfo && this.rowInfo.rowLength === 0) {
      this.reset();
    } else {
      super.addSample(range, size);
    }
  }

  /**
   * A temp workaround to solve the actual vs wanted rendered row issue in `CdkVirtualScrollViewport`
   *
   * `CdkVirtualScrollViewport.getRenderedRange()` return the rows that the virtual container want's the grid to render
   * however, the actual rendered rows might be different. This is a problem especially in init, when the rendered rows are actually 0
   * but `CdkVirtualScrollViewport.getRenderedRange()` return the initial range of rows that should be rendered. This results in a wrong
   * calculation of the average item size in `ItemSizeAverager`
   *
   * SEE: https://github.com/angular/material2/blob/a9e550e5bf93cd68c342d1a50d8576d8f3812ebe/src/cdk/scrolling/virtual-scroll-viewport.ts#L212-L220
   */
  setRowInfo(rowInfo: NgeVirtualTableRowInfo): void {
    this.rowInfo = rowInfo;
  }
}


export class TableAutoSizeVirtualScrollStrategy extends AutoSizeVirtualScrollStrategy {
  constructor(minBufferPx: number, maxBufferPx: number, public readonly averager = new TableItemSizeAverager()) {
    super(minBufferPx, maxBufferPx, averager);
  }
}
