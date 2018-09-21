import { Observable, Subject } from 'rxjs';

import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Inject,
  ChangeDetectorRef,
  ViewEncapsulation,
  NgZone,
  Optional,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Directionality } from '@angular/cdk/bidi';
import {
  CdkVirtualScrollViewport,
  VIRTUAL_SCROLL_STRATEGY,
  VirtualScrollStrategy,
  ScrollDispatcher,
} from '@angular/cdk/scrolling';
import { AutoSizeVirtualScrollStrategy } from '@angular/cdk-experimental/scrolling';
import { NoVirtualScrollStrategy } from './strategies';

@Component({
  selector: 'sg-cdk-virtual-scroll-viewport',
  templateUrl: 'virtual-scroll-viewport.component.html',
  host: {
    class: 'cdk-virtual-scroll-viewport',
    '[class.cdk-virtual-scroll-orientation-horizontal]': 'orientation === "horizontal"',
    '[class.cdk-virtual-scroll-orientation-vertical]': 'orientation === "vertical"'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SgCdkVirtualScrollViewportComponent extends CdkVirtualScrollViewport implements OnInit, OnDestroy {

  readonly enabled: boolean;

  /**
   * Emits the offset (in pixels) of the rendered content every time it changes.
   * The emission is done OUTSIDE of angular (i.e. no change detection cycle is triggered).
   *
   * Note that when not enabled (i.e `NoVirtualScrollStrategy` is used) there are not emissions.
   */
  readonly offsetChange: Observable<number>;

  private offsetChange$ = new Subject<number>();
  private offset: number;
  private isCDPending: boolean;

  constructor(elementRef: ElementRef<HTMLElement>,
              cdr: ChangeDetectorRef,
              ngZone: NgZone,
              @Optional() @Inject(VIRTUAL_SCROLL_STRATEGY) sgScrollStrategy: VirtualScrollStrategy,
              @Optional() dir: Directionality,
              scrollDispatcher: ScrollDispatcher) {
    super(elementRef, cdr, ngZone, sgScrollStrategy || (sgScrollStrategy = new AutoSizeVirtualScrollStrategy(100, 200)), dir, scrollDispatcher);
    this.enabled = !(sgScrollStrategy instanceof NoVirtualScrollStrategy);
    this.offsetChange = this.offsetChange$.asObservable();
  }

  ngOnInit(): void {
    if (this.enabled) {
      super.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.offsetChange$.complete();
  }

  setRenderedContentOffset(offset: number, to: 'to-start' | 'to-end' = 'to-start') {
    super.setRenderedContentOffset(offset, to);
    if (this.enabled && this.offset !== offset) {
      this.offset = offset;
      if (!this.isCDPending) {
        this.isCDPending = true;
        this.ngZone.runOutsideAngular(() => Promise.resolve().then(() => {
          this.isCDPending = false;
          this.offsetChange$.next(this.offset);
        }));
      }
    }
  }

}
