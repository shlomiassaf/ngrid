import { Observable } from 'rxjs';
import { Directive, Input, OnInit, OnChanges, ElementRef } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { PblNgridExtensionApi } from '../../../../ext/grid-ext-api';
import { PblNgridComponent } from '../../../ngrid.component';
import { PblNgridFixedSizeVirtualScrollStrategy } from './fixed-size';
import { PblNgridAutoSizeVirtualScrollStrategy, PblNgridItemSizeAverager } from './auto-size';
import { NoVirtualScrollStrategy } from './noop';
import { PblNgridDynamicVirtualScrollStrategy } from './dynamic-size/dynamic-size';
import { PblNgridVirtualScrollStrategy } from './types';

const TYPES: Array<'vScrollFixed' | 'vScrollAuto' | 'vScrollDynamic' | 'vScrollNone'> = ['vScrollAuto', 'vScrollFixed', 'vScrollDynamic', 'vScrollNone'];

export function _vScrollStrategyFactory(directive: { _scrollStrategy: PblNgridVirtualScrollStrategy; }) {
  return directive._scrollStrategy;
}

/** A virtual scroll strategy that supports unknown or dynamic size items. */
@Directive({
  selector: 'pbl-ngrid[vScrollDynamic], pbl-ngrid[vScrollAuto], pbl-ngrid[vScrollFixed], pbl-ngrid[vScrollNone]', // tslint:disable-line: directive-selector
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useExisting: PblCdkVirtualScrollDirective,
  }],
})
export class PblCdkVirtualScrollDirective implements OnInit, OnChanges, PblNgridVirtualScrollStrategy {
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
   * The size of the items in the list (in pixels).
   * Valid for `vScrollFixed` only!
   *
   * Default: 20
   */
  @Input() get vScrollDynamic(): number { return this._vScrollDynamic; }
  set vScrollDynamic(value: number) { this._vScrollDynamic = value; }
  _vScrollDynamic: number;

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
  _scrollStrategy: PblNgridVirtualScrollStrategy;

  get type(): 'vScrollFixed' | 'vScrollAuto' | 'vScrollDynamic' | 'vScrollNone' { return this._type; };
  private _type: 'vScrollFixed' | 'vScrollAuto' | 'vScrollDynamic' | 'vScrollNone';

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
      } else if ('_vScrollDynamic' in <any>this) {
        this._type = 'vScrollDynamic';
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
      case 'vScrollDynamic':
        if (!this._vScrollDynamic) {
          this.vScrollDynamic  = this.grid.findInitialRowHeight() || 48;
        }
        this._scrollStrategy = new PblNgridDynamicVirtualScrollStrategy(this.vScrollDynamic, this.minBufferPx, this.maxBufferPx);
        break;
      case 'vScrollAuto':
        if (!this._vScrollAuto) {
          this._vScrollAuto  = this.grid.findInitialRowHeight() || 48;
        }
        this._scrollStrategy = new PblNgridAutoSizeVirtualScrollStrategy(this.minBufferPx, this.maxBufferPx, new PblNgridItemSizeAverager(this._vScrollAuto));
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
        case 'vScrollDynamic':
          (this._scrollStrategy as PblNgridDynamicVirtualScrollStrategy)
            .updateItemAndBufferSize(this.vScrollDynamic, this.minBufferPx, this.maxBufferPx);
          break;
        case 'vScrollAuto':
          (this._scrollStrategy as PblNgridAutoSizeVirtualScrollStrategy)
            .updateBufferSize(this.minBufferPx, this.maxBufferPx);
          break;
        default:
          break;
      }
    }
  }

  get scrolledIndexChange(): Observable<number> { return this._scrollStrategy.scrolledIndexChange; }
  set scrolledIndexChange(value: Observable<number>) { this._scrollStrategy.scrolledIndexChange = value; }
  attachExtApi(extApi: PblNgridExtensionApi): void { this._scrollStrategy.attachExtApi(extApi); }
  attach(viewport: CdkVirtualScrollViewport): void { this._scrollStrategy.attach(viewport); }
  detach(): void { this._scrollStrategy.detach(); }
  onContentScrolled(): void { this._scrollStrategy.onContentScrolled(); }
  onDataLengthChanged(): void { this._scrollStrategy.onDataLengthChanged(); }
  onContentRendered(): void { this._scrollStrategy.onContentRendered(); }
  onRenderedOffsetChanged(): void { this._scrollStrategy.onRenderedOffsetChanged(); }
  scrollToIndex(index: number, behavior: ScrollBehavior): void { this._scrollStrategy.scrollToIndex(index, behavior); }
}
