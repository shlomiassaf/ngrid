import { OnDestroy, ElementRef, Directive, Inject } from '@angular/core';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { unrx } from '../utils/unrx';
import { PblNgridBaseRowComponent } from '../row/base-row.component';
import { GridRowType } from '../row/types';

@Directive()
export class PblNgridBaseCell<TRow extends PblNgridBaseRowComponent<GridRowType> = PblNgridBaseRowComponent<GridRowType>> implements OnDestroy {
  el: HTMLElement;

  get owner() { return this._owner; }

  private _owner: TRow;

  constructor(@Inject(EXT_API_TOKEN) protected extApi: PblNgridInternalExtensionApi, elementRef: ElementRef<HTMLElement>) {
    this.el = elementRef.nativeElement;
  }

  setOwner(owner: TRow) {
    this._owner = owner;
  }

  focus() {
    this.el.focus({ preventScroll: true });
    this.extApi.viewport._scrollIntoView(this.el);
  }

  ngOnDestroy(): void {
    unrx.kill(this);
  }
}
