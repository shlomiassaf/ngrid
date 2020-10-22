import { OnDestroy, ElementRef, DoCheck, Directive } from '@angular/core';
import { unrx } from '../utils/unrx';

@Directive()
export class PblNgridBaseCell implements OnDestroy {
  protected el: HTMLElement;

  constructor(elementRef: ElementRef<HTMLElement>) {
    this.el = elementRef.nativeElement;
  }

  ngOnDestroy(): void {
    unrx.kill(this);
  }
}
