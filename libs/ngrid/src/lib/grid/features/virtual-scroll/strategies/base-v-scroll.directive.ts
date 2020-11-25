import { Observable } from 'rxjs';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { PblNgridExtensionApi } from '../../../../ext/grid-ext-api';
import { PblNgridComponent } from '../../../ngrid.component';
import { PblCdkVirtualScrollViewportComponent } from '../virtual-scroll-viewport.component';
import { PblNgridVirtualScrollStrategy, PblNgridVirtualScrollStrategyMap } from './types';

export abstract class PblNgridBaseVirtualScrollDirective<T extends keyof PblNgridVirtualScrollStrategyMap = keyof PblNgridVirtualScrollStrategyMap> implements PblNgridVirtualScrollStrategy<T> {

  /**
   * The minimum amount of buffer rendered beyond the viewport (in pixels).
   * If the amount of buffer dips below this number, more items will be rendered. Defaults to 100px.
   *
   * Default: 100
   */
  get minBufferPx(): NumberInput { return this._minBufferPx; }
  set minBufferPx(value: NumberInput) { this._minBufferPx = coerceNumberProperty(value); }

  /**
   * The number of pixels worth of buffer to render for when rendering new items. Defaults to 200px.
   *
   * Default: 200
   */
  get maxBufferPx(): NumberInput { return this._maxBufferPx; }
  set maxBufferPx(value: NumberInput) { this._maxBufferPx = coerceNumberProperty(value); }

  get wheelMode(): 'passive' | 'blocking' | number { return this._wheelMode; }
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

  protected _wheelMode: 'passive' | 'blocking' | number;
  protected _maxBufferPx = 200;
  protected _minBufferPx = 100;

  constructor(protected grid: PblNgridComponent, public readonly type: T) { }

  /** The scroll strategy used by this directive. */
  _scrollStrategy: PblNgridVirtualScrollStrategyMap[T];

  get scrolledIndexChange(): Observable<number> { return this._scrollStrategy.scrolledIndexChange; }
  set scrolledIndexChange(value: Observable<number>) { this._scrollStrategy.scrolledIndexChange = value; }
  attachExtApi(extApi: PblNgridExtensionApi): void { this._scrollStrategy.attachExtApi(extApi); }
  attach(viewport: PblCdkVirtualScrollViewportComponent): void { this._scrollStrategy.attach(viewport); }
  detach(): void { this._scrollStrategy.detach(); }
  onContentScrolled(): void { this._scrollStrategy.onContentScrolled(); }
  onDataLengthChanged(): void { this._scrollStrategy.onDataLengthChanged(); }
  onContentRendered(): void { this._scrollStrategy.onContentRendered(); }
  onRenderedOffsetChanged(): void { this._scrollStrategy.onRenderedOffsetChanged(); }
  scrollToIndex(index: number, behavior: ScrollBehavior): void { this._scrollStrategy.scrollToIndex(index, behavior); }
}
