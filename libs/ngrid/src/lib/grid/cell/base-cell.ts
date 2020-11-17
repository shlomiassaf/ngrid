import { OnDestroy, ElementRef, Directive, Inject } from '@angular/core';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { unrx } from '../utils/unrx';

@Directive()
export class PblNgridBaseCell implements OnDestroy {
  el: HTMLElement;

  constructor(@Inject(EXT_API_TOKEN) protected extApi: PblNgridInternalExtensionApi, elementRef: ElementRef<HTMLElement>) {
    this.el = elementRef.nativeElement;
  }

  focus() {
    this.el.focus({ preventScroll: true });
    this.extApi.viewport._scrollIntoView(this.el);
  }

  ngOnDestroy(): void {
    unrx.kill(this);
  }
}
