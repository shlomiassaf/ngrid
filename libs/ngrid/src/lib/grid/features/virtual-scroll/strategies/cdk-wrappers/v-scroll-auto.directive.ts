import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { Directive, Input, OnInit, OnChanges } from '@angular/core';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { PblNgridComponent } from '../../../../ngrid.component';
import { PblNgridBaseVirtualScrollDirective } from '../base-v-scroll.directive';
import { PblNgridAutoSizeVirtualScrollStrategy, PblNgridItemSizeAverager } from './auto-size';

/**
 * @deprecated Will be removed in v5
 * `vScrollAuto` will move to an independent package in v5. Note that the recommended dynamic strategy for nGrid is `vScrollDynamic`
 * Note that the default virtual scroll strategy will also change from `vScrollAuto` to `vScrollDynamic`
 */
@Directive({
  selector: 'pbl-ngrid[vScrollAuto]', // tslint:disable-line: directive-selector
  inputs: [ 'minBufferPx', 'maxBufferPx', 'wheelMode' ], // tslint:disable-line: no-inputs-metadata-property
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useExisting: PblCdkAutoSizeVirtualScrollDirective,
  }],
})
export class PblCdkAutoSizeVirtualScrollDirective extends PblNgridBaseVirtualScrollDirective<'vScrollAuto'> implements OnInit, OnChanges {

  /**
   * The size of the items in the list (in pixels).
   * If this value is not set the height is calculated from the first rendered row item.
   *
   * @deprecated Will be removed in v5: `vScrollAuto` will move to an independent package in v5. Note that the recommended dynamic strategy for nGrid is `vScrollDynamic`
   */
  @Input() get vScrollAuto(): NumberInput { return this._vScrollAuto; }
  set vScrollAuto(value: NumberInput) { this._vScrollAuto = coerceNumberProperty(value); }

  private _vScrollAuto: number;
  constructor(grid: PblNgridComponent<any>) { super(grid, 'vScrollAuto'); }

  ngOnInit(): void {
    if (!this._vScrollAuto) {
      this._vScrollAuto  = this.grid.findInitialRowHeight() || 48;
    }
    this._scrollStrategy = new PblNgridAutoSizeVirtualScrollStrategy(this._minBufferPx, this._maxBufferPx, new PblNgridItemSizeAverager(this._vScrollAuto));
  }

  ngOnChanges() {
    this._scrollStrategy?.updateBufferSize(this._minBufferPx, this._maxBufferPx);
  }
}
