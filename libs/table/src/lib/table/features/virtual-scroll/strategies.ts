import { Directive, forwardRef, Input, OnChanges, ElementRef } from '@angular/core';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy, VirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { AutoSizeVirtualScrollStrategy, ItemSizeAverager } from '@angular/cdk-experimental/scrolling';

import { NgeVirtualTableRowInfo } from './virtual-scroll-for-of';

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
   * `CdkVirtualScrollViewport.getRenderedRange()` return the rows that the virtual container want's the table to render
   * however, the actual rendered rows might be different. This is a problem especially in init, when the rendered rows are actually 0
   * but `CdkVirtualScrollViewport.getRenderedRange()` return the initial range of rows that should be rendered. This results in a wrong
   * calculation of the average item size in `ItemSizeAverager`
   * 
   * SEE: https://github.com/angular/material2/blob/a9e550e5bf93cd68c342d1a50d8576d8f3812ebe/src/cdk/scrolling/virtual-scroll-viewport.ts#L212-L220
   */
  setRowInfo(rowInfo: NgeVirtualTableRowInfo): void {
    this.rowInfo = rowInfo;;
  }
}

export class TableAutoSizeVirtualScrollStrategy extends AutoSizeVirtualScrollStrategy {
  constructor(minBufferPx: number, maxBufferPx: number, public readonly averager = new TableItemSizeAverager()) {
    super(minBufferPx, maxBufferPx, averager);
  }
}

const TYPES: Array<'vScrollFixed' | 'vScrollAuto' | 'vScrollNone'> = ['vScrollAuto', 'vScrollFixed', 'vScrollNone'];

export function _vScrollStrategyFactory(directive: { _scrollStrategy: VirtualScrollStrategy; }) {
  return directive._scrollStrategy;
}

/** A virtual scroll strategy that supports unknown or dynamic size items. */
@Directive({
  selector: 'neg-table[vScrollAuto], neg-table[vScrollFixed], neg-table[vScrollNone]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useFactory: _vScrollStrategyFactory,
    deps: [forwardRef(() => NegCdkVirtualScrollDirective)],
  }],
})
export class NegCdkVirtualScrollDirective implements OnChanges {
  /**
   * The size of the items in the list (in pixels).
   * Valid for `vScrollFixed` only!
   *
   * Default: 20
   */
  get vScrollFixed(): number { return this._vScrollFixed; }
  @Input() set vScrollFixed(value: number) { this._vScrollFixed = value; }
  _vScrollFixed = 20;

  /**
   * The minimum amount of buffer rendered beyond the viewport (in pixels).
   * If the amount of buffer dips below this number, more items will be rendered. Defaults to 100px.
   *
   * Valid for `vScrollAuto` and `vScrollFixed` only!
   * Default: 100
   */
  @Input()
  get minBufferPx(): number { return this._minBufferPx; }
  set minBufferPx(value: number) { this._minBufferPx = coerceNumberProperty(value); }
  _minBufferPx = 100;

  /**
   * The number of pixels worth of buffer to render for when rendering new items. Defaults to 200px.
   *
   * Valid for `vScrollAuto` and `vScrollFixed` only!
   * Default: 100
   */
  @Input()
  get maxBufferPx(): number { return this._maxBufferPx; }
  set maxBufferPx(value: number) { this._maxBufferPx = coerceNumberProperty(value); }
  _maxBufferPx = 200;

  /** The scroll strategy used by this directive. */
  _scrollStrategy: VirtualScrollStrategy;

  private type: 'vScrollFixed' | 'vScrollAuto' | 'vScrollNone';

  constructor(el: ElementRef<HTMLElement>) {
    const types = TYPES.filter( t => el.nativeElement.hasAttribute(t));
    if (types.length > 1) {
      throw new Error(`Invalid vScroll instruction, only one value is allow: ${JSON.stringify(types)}`);
    } else {
      this.type = types[0];
    }
    switch (this.type) {
      case 'vScrollFixed':
        this._scrollStrategy = new FixedSizeVirtualScrollStrategy(this.vScrollFixed, this.minBufferPx, this.maxBufferPx);
        break;
      case 'vScrollAuto':
        this._scrollStrategy = new TableAutoSizeVirtualScrollStrategy(this.minBufferPx, this.maxBufferPx);
        break;
      default:
        this._scrollStrategy = new NoVirtualScrollStrategy();
        break;
    }
  }

  ngOnChanges() {
    switch (this.type) {
      case 'vScrollFixed':
        (this._scrollStrategy as FixedSizeVirtualScrollStrategy)
          .updateItemAndBufferSize(this.vScrollFixed, this.minBufferPx, this.maxBufferPx);
        break;
      case 'vScrollAuto':
        (this._scrollStrategy as TableAutoSizeVirtualScrollStrategy)
          .updateBufferSize(this.minBufferPx, this.maxBufferPx);
        break;
      default:
        break;
    }
  }
}
