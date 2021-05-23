import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { Directive, Input, OnInit, OnChanges } from '@angular/core';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { PblNgridComponent } from '../../../../ngrid.component';
import { PblNgridBaseVirtualScrollDirective } from '../base-v-scroll.directive';
import { PblNgridFixedSizeVirtualScrollStrategy } from './fixed-size';

/**
 * @deprecated Will be removed in v5
 * `vScrollFixed` will move to an independent package in v5.
 * Note that the recommended dynamic strategy for nGrid is `vScrollDynamic`
 */
@Directive({
  selector: 'pbl-ngrid[vScrollFixed]', // tslint:disable-line: directive-selector
  inputs: [ 'minBufferPx', 'maxBufferPx', 'wheelMode' ], // tslint:disable-line: no-inputs-metadata-property
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useExisting: PblCdkFixedSizedVirtualScrollDirective,
  }],
})
export class PblCdkFixedSizedVirtualScrollDirective extends PblNgridBaseVirtualScrollDirective<'vScrollFixed'> implements OnInit, OnChanges {

  /**
   * The size of the items in the list (in pixels).
   * If this value is not set the height is calculated from the first rendered row item.
   *
   * @deprecated Will be removed in v5: `vScrollFixed` will move to an independent package in v5. Note that the recommended dynamic strategy for nGrid is `vScrollDynamic`
   */
  @Input() get vScrollFixed(): NumberInput { return this._vScrollFixed; }
  set vScrollFixed(value: NumberInput) { this._vScrollFixed = coerceNumberProperty(value); }

  private _vScrollFixed: number;

  constructor(grid: PblNgridComponent) { super(grid, 'vScrollFixed'); }

  ngOnInit(): void {
    if (!this._vScrollFixed) {
      this.vScrollFixed  = this.grid.findInitialRowHeight() || 48;
    }
    this._scrollStrategy = new PblNgridFixedSizeVirtualScrollStrategy(this._vScrollFixed, this._minBufferPx, this._maxBufferPx);
  }

  ngOnChanges() {
    this._scrollStrategy?.updateItemAndBufferSize(this._vScrollFixed, this._minBufferPx, this._maxBufferPx);
  }
}
