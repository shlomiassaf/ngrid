import { Observable } from 'rxjs';
import { Directive, Input, OnInit, OnChanges, ElementRef } from '@angular/core';

import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy, VirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { AutoSizeVirtualScrollStrategy, ItemSizeAverager } from '@angular/cdk-experimental/scrolling';

import { NegTableComponent } from '../../table.component';
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
    this.rowInfo = rowInfo;
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
    useExisting: NegCdkVirtualScrollDirective,
  }],
})
export class NegCdkVirtualScrollDirective implements OnInit, OnChanges, VirtualScrollStrategy {
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

  readonly type: 'vScrollFixed' | 'vScrollAuto' | 'vScrollNone';

  constructor(el: ElementRef<HTMLElement>, private table: NegTableComponent<any>) {
    const types = TYPES.filter( t => el.nativeElement.hasAttribute(t));
    if (types.length > 1) {
      throw new Error(`Invalid vScroll instruction, only one value is allow: ${JSON.stringify(types)}`);
    } else {
      this.type = types[0];
    }
  }

  ngOnInit(): void {
    switch (this.type) {
      case 'vScrollFixed':
        if (!this._vScrollFixed) {
          this.vScrollFixed  = this.table.findInitialRowHeight() || 48;
        }
        this._scrollStrategy = new FixedSizeVirtualScrollStrategy(this.vScrollFixed, this.minBufferPx, this.maxBufferPx);
        break;
      case 'vScrollAuto':
        if (!this._vScrollAuto) {
          this._vScrollAuto  = this.table.findInitialRowHeight() || 48;
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

  get scrolledIndexChange(): Observable<number> { return this._scrollStrategy.scrolledIndexChange; }
  set scrolledIndexChange(value: Observable<number>) { this._scrollStrategy.scrolledIndexChange = value; }
  attach(viewport: CdkVirtualScrollViewport): void { this._scrollStrategy.attach(viewport); }
  detach(): void { this._scrollStrategy.detach(); }
  onContentScrolled(): void { this._scrollStrategy.onContentScrolled(); }
  onDataLengthChanged(): void { this._scrollStrategy.onDataLengthChanged(); }
  onContentRendered(): void { this._scrollStrategy.onContentRendered(); }
  onRenderedOffsetChanged(): void { this._scrollStrategy.onRenderedOffsetChanged(); }
  scrollToIndex(index: number, behavior: ScrollBehavior): void { this.scrollToIndex(index, behavior); }
}
