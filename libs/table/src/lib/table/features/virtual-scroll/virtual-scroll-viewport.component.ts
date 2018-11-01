import { Observable, Subject } from 'rxjs';

import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Inject,
  Input,
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
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';

import { NegTableConfigService } from '../../services/config';
import { NoVirtualScrollStrategy, TableAutoSizeVirtualScrollStrategy } from './strategies';
import { NgeVirtualTableRowInfo } from './virtual-scroll-for-of';

declare module '../../services/config' {
  interface NegTableConfig {
    virtualScroll?: {
      defaultStrategy?(): VirtualScrollStrategy;
    }
  }
}

function resolveScrollStrategy(config: NegTableConfigService, scrollStrategy?: VirtualScrollStrategy): VirtualScrollStrategy {
  if (!scrollStrategy && config.has('virtualScroll')) {
    const virtualScrollConfig = config.get('virtualScroll');
    if (typeof virtualScrollConfig.defaultStrategy === 'function') {
      scrollStrategy = virtualScrollConfig.defaultStrategy();
    }
  }

  return scrollStrategy || new TableAutoSizeVirtualScrollStrategy(100, 200);
}

@Component({
  selector: 'neg-cdk-virtual-scroll-viewport',
  templateUrl: 'virtual-scroll-viewport.component.html',
  styleUrls: [ './virtual-scroll-viewport.component.scss' ],
  host: { // tslint:disable-line:use-host-property-decorator
    class: 'cdk-virtual-scroll-viewport',
    '[class.cdk-virtual-scroll-orientation-horizontal]': 'orientation === "horizontal"',
    '[class.cdk-virtual-scroll-orientation-vertical]': 'orientation === "vertical"'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NegCdkVirtualScrollViewportComponent extends CdkVirtualScrollViewport implements OnInit, OnDestroy {

  readonly enabled: boolean;

  /**
   * Emits the offset (in pixels) of the rendered content every time it changes.
   * The emission is done OUTSIDE of angular (i.e. no change detection cycle is triggered).
   *
   * Note that when not enabled (i.e `NoVirtualScrollStrategy` is used) there are not emissions.
   */
  readonly offsetChange: Observable<number>;

  @Input() minWidth: string;

  totalContentSize = 0;

  private offsetChange$ = new Subject<number>();
  private offset: number;
  private isCDPending: boolean;

  constructor(elementRef: ElementRef<HTMLElement>,
              cdr: ChangeDetectorRef,
              ngZone: NgZone,
              config: NegTableConfigService,
              @Optional() @Inject(VIRTUAL_SCROLL_STRATEGY) private negScrollStrategy: VirtualScrollStrategy,
              @Optional() dir: Directionality,
              scrollDispatcher: ScrollDispatcher) {
    super(elementRef,
          cdr,
          ngZone,
          negScrollStrategy = resolveScrollStrategy(config, negScrollStrategy),
          dir,
          scrollDispatcher
      );
    this.enabled = !(negScrollStrategy instanceof NoVirtualScrollStrategy);
    this.offsetChange = this.offsetChange$.asObservable();
  }

  attach(forOf: CdkVirtualForOf<any> & NgeVirtualTableRowInfo) {
    super.attach(forOf);
    if (this.negScrollStrategy instanceof TableAutoSizeVirtualScrollStrategy) {
      this.negScrollStrategy.averager.setRowInfo(forOf);
    }
  }

  setTotalContentSize(size: number) {
    super.setTotalContentSize(this.totalContentSize = size);
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
