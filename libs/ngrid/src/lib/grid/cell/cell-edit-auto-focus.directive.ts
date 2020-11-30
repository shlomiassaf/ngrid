import { take } from 'rxjs/operators';

import { Directive, AfterViewInit, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { PblNgridCellContext } from '../context/index';

@Directive({ selector: '[pblCellEditAutoFocus]' })
export class PblNgridCellEditAutoFocusDirective implements AfterViewInit, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('pblCellEditAutoFocus') context: PblNgridCellContext<any>;

  private _destroyed: boolean;

  constructor(private elRef: ElementRef<HTMLElement>, private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    const doFocus = () => {
      const context = this.context;
      if (context.editing && !context.rowContext.outOfView) {
        this.elRef.nativeElement.focus();
      }
    };

    this.ngZone.runOutsideAngular(() => {
      Promise.resolve().then(() => {
        if (!this._destroyed) {
          const { viewport } = this.context.grid;
          if (viewport && viewport.isScrolling) {
            viewport.scrolling.pipe(take(1)).subscribe(doFocus);
          } else {
            doFocus();
          }
        }
      });
    });
  }

  ngOnDestroy(): void {
    this._destroyed = true;
  }
}
