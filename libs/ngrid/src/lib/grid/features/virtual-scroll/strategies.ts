import { Observable } from 'rxjs';
import { Directive, Input, OnInit, OnChanges, ElementRef } from '@angular/core';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy, VirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { AutoSizeVirtualScrollStrategy, ItemSizeAverager } from '@angular/cdk-experimental/scrolling';

import { PblNgridComponent } from '../../ngrid.component';
import { NgeVirtualTableRowInfo } from './virtual-scroll-for-of';
import { P } from '@angular/cdk/keycodes';

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

export class PblNgridFixedSizeVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {

  private _ngridViewport: CdkVirtualScrollViewport;

  constructor(private itemSize: number, minBufferPx: number, maxBufferPx: number) {
    super(itemSize, minBufferPx, maxBufferPx);
  }

  attach(viewport: CdkVirtualScrollViewport) {
    super.attach(this._ngridViewport = viewport);
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
    if (!this._ngridViewport) {
      return;
    }
    let { start, end } = this._ngridViewport.getRenderedRange();
    const rangeLength = end - start;
    const dataLength = this._ngridViewport.getDataLength();
    if (rangeLength < 0 && dataLength < -rangeLength) {
      start = dataLength - end;
      this._ngridViewport.setRenderedRange({ start, end });
      this._ngridViewport.setRenderedContentOffset(this.itemSize * start);
      // this._scrolledIndexChange.next(Math.floor(firstVisibleIndex));
    } else {
      super.onContentScrolled();
    }
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
  selector: 'pbl-ngrid[vScrollAuto], pbl-ngrid[vScrollFixed], pbl-ngrid[vScrollNone]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useExisting: PblCdkVirtualScrollDirective,
  }],
})
export class PblCdkVirtualScrollDirective implements OnInit, OnChanges, VirtualScrollStrategy {
    /**
   * The size of the items in the list (in pixels).
   * Valid for `vScrollFixed` only!
   *
   * Default: 20
   */
  @Input() get vScrollAuto(): number { return this._vScrollAuto; }
  set vScrollAuto(value: number) { this._vScrollAuto = coerceNumberProperty(value); }
  _vScrollAuto: number;

  /**
   * The size of the items in the list (in pixels).
   * Valid for `vScrollFixed` only!
   *
   * Default: 20
   */
  @Input() get vScrollFixed(): number { return this._vScrollFixed; }
  set vScrollFixed(value: number) { this._vScrollFixed = value; }
  _vScrollFixed: number;

  /**
   * The minimum amount of buffer rendered beyond the viewport (in pixels).
   * If the amount of buffer dips below this number, more items will be rendered. Defaults to 100px.
   *
   * Valid for `vScrollAuto` and `vScrollFixed` only!
   * Default: 100
   */
  @Input() get minBufferPx(): number { return this._minBufferPx; }
  set minBufferPx(value: number) { this._minBufferPx = coerceNumberProperty(value); }
  _minBufferPx = 100;

  /**
   * The number of pixels worth of buffer to render for when rendering new items. Defaults to 200px.
   *
   * Valid for `vScrollAuto` and `vScrollFixed` only!
   * Default: 100
   */
  @Input() get maxBufferPx(): number { return this._maxBufferPx; }
  set maxBufferPx(value: number) { this._maxBufferPx = coerceNumberProperty(value); }
  _maxBufferPx = 200;

  @Input() get wheelMode(): 'passive' | 'blocking' | number { return this._wheelMode; }
  set wheelMode(value: 'passive' | 'blocking' | number) {
    switch (value) {
      case 'passive':
      case 'blocking':
       this._wheelMode = value;
       break;
      default:
        const wheelMode = coerceNumberProperty(value);
        if (wheelMode && wheelMode >= 1 && wheelMode <= 60) {
          this._wheelMode = wheelMode;
        }
        break;
    }
  }
  _wheelMode: 'passive' | 'blocking' | number;

  /** The scroll strategy used by this directive. */
  _scrollStrategy: VirtualScrollStrategy;

  get type(): 'vScrollFixed' | 'vScrollAuto' | 'vScrollNone' { return this._type; };
  private _type: 'vScrollFixed' | 'vScrollAuto' | 'vScrollNone';

  constructor(el: ElementRef<HTMLElement>, private grid: PblNgridComponent<any>) {
    const types = TYPES.filter( t => el.nativeElement.hasAttribute(t));

    if (types.length > 1) {
      throw new Error(`Invalid vScroll instruction, only one value is allow: ${JSON.stringify(types)}`);
    } else {
      this._type = types[0];
    }
  }

  ngOnInit(): void {
    if (!this._type) {
      if ('_vScrollFixed' in <any>this) {
        this._type = 'vScrollFixed';
      } else if ('_vScrollAuto' in <any>this) {
        this._type = 'vScrollAuto';
      } else {
        this._type = 'vScrollNone';
      }
    }
    switch (this.type) {
      case 'vScrollFixed':
        if (!this._vScrollFixed) {
          this.vScrollFixed  = this.grid.findInitialRowHeight() || 48;
        }
        this._scrollStrategy = new PblNgridFixedSizeVirtualScrollStrategy(this.vScrollFixed, this.minBufferPx, this.maxBufferPx);
        break;
      case 'vScrollAuto':
        if (!this._vScrollAuto) {
          this._vScrollAuto  = this.grid.findInitialRowHeight() || 48;
        }
        this._scrollStrategy = new TableAutoSizeVirtualScrollStrategy(this.minBufferPx, this.maxBufferPx, new TableItemSizeAverager(this._vScrollAuto));
        break;
      default:
        this._scrollStrategy = new NoVirtualScrollStrategy();
        break;
    }
  }

  ngOnChanges() {
    if (this._scrollStrategy) {
      switch (this.type) {
        case 'vScrollFixed':
          (this._scrollStrategy as PblNgridFixedSizeVirtualScrollStrategy)
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

  get scrolledIndexChange(): Observable<number> { return this._scrollStrategy.scrolledIndexChange; }
  set scrolledIndexChange(value: Observable<number>) { this._scrollStrategy.scrolledIndexChange = value; }
  attach(viewport: CdkVirtualScrollViewport): void { this._scrollStrategy.attach(viewport); }
  detach(): void { this._scrollStrategy.detach(); }
  onContentScrolled(): void { this._scrollStrategy.onContentScrolled(); }
  onDataLengthChanged(): void { this._scrollStrategy.onDataLengthChanged(); }
  onContentRendered(): void { this._scrollStrategy.onContentRendered(); }
  onRenderedOffsetChanged(): void { this._scrollStrategy.onRenderedOffsetChanged(); }
  scrollToIndex(index: number, behavior: ScrollBehavior): void { this._scrollStrategy.scrollToIndex(index, behavior); }
}
