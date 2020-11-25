import { Directive, Input, OnInit, OnChanges, Attribute } from '@angular/core';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { PblNgridComponent } from '../../../ngrid.component';
import { NoVirtualScrollStrategy } from './noop';
import { PblNgridDynamicVirtualScrollStrategy } from './dynamic-size/dynamic-size';
import { PblNgridBaseVirtualScrollDirective } from './base-v-scroll.directive';

/** A virtual scroll strategy that supports unknown or dynamic size items. */
@Directive({
  selector: 'pbl-ngrid[vScrollDynamic], pbl-ngrid[vScrollNone]', // tslint:disable-line: directive-selector
  inputs: [ 'minBufferPx', 'maxBufferPx', 'wheelMode' ], // tslint:disable-line: no-inputs-metadata-property
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useExisting: PblCdkVirtualScrollDirective,
  }],
})
export class PblCdkVirtualScrollDirective extends PblNgridBaseVirtualScrollDirective<'vScrollDynamic' | 'vScrollNone'> implements OnInit, OnChanges {

  /**
   * The size of the items in the list (in pixels).
   * If this value is not set the height is calculated from the first rendered row item.
   */
  @Input() get vScrollDynamic(): NumberInput { return this._vScrollDynamic; }
  set vScrollDynamic(value: NumberInput) { this._vScrollDynamic = coerceNumberProperty(value); }

  private _vScrollDynamic: number;

  constructor(@Attribute('vScrollDynamic') vScrollDynamic: any,
              @Attribute('vScrollNone') vScrollNone: any,
              grid: PblNgridComponent<any>) {
    super(grid, vScrollDynamic === null ? 'vScrollNone' : 'vScrollDynamic');
    if (vScrollDynamic !== null && vScrollNone !== null) {
      throw new Error(`Invalid vScroll instruction, only one value is allow.`);
    }
  }

  ngOnInit(): void {
    switch (this.type) {
      case 'vScrollDynamic':
        if (!this._vScrollDynamic) {
          this.vScrollDynamic  = this.grid.findInitialRowHeight() || 48;
        }
        this._scrollStrategy = new PblNgridDynamicVirtualScrollStrategy(this._vScrollDynamic, this._minBufferPx, this._maxBufferPx);
        break;
      default:
        this._scrollStrategy = new NoVirtualScrollStrategy();
        break;
    }
  }

  ngOnChanges() {
    if (this._scrollStrategy) {
      switch (this.type) {
        case 'vScrollDynamic':
          (this._scrollStrategy as PblNgridDynamicVirtualScrollStrategy)?.updateItemAndBufferSize(this._vScrollDynamic, this._minBufferPx, this._maxBufferPx);
          break;
        default:
          break;
      }
    }
  }

}
