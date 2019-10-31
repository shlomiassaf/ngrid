import { Observable, Subject } from 'rxjs';

import {
  AfterViewInit,
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  ChangeDetectorRef,
  ViewEncapsulation,
  NgZone,
  Output,
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
  CdkScrollable,
} from '@angular/cdk/scrolling';

import { UnRx } from '@pebula/utils';

import { PblNgridPluginController } from '../../../ext/plugin-control';
import { PblNgridConfigService } from '../../services/config';
import { PblNgridComponent } from '../../table.component';
import { PblCdkVirtualScrollDirective, NoVirtualScrollStrategy, TableAutoSizeVirtualScrollStrategy } from './strategies';
import { NgeVirtualTableRowInfo } from './virtual-scroll-for-of';

declare module '../../services/config' {
  interface PblNgridConfig {
    virtualScroll?: {
      wheelMode?: PblCdkVirtualScrollDirective['wheelMode'];
      defaultStrategy?(): VirtualScrollStrategy;
    }
  }
}

function resolveScrollStrategy(config: PblNgridConfigService, scrollStrategy?: VirtualScrollStrategy): VirtualScrollStrategy {
  if (!scrollStrategy && config.has('virtualScroll')) {
    const virtualScrollConfig = config.get('virtualScroll');
    if (typeof virtualScrollConfig.defaultStrategy === 'function') {
      scrollStrategy = virtualScrollConfig.defaultStrategy();
    }
  }

  return scrollStrategy || new TableAutoSizeVirtualScrollStrategy(100, 200);
}

@Component({
  selector: 'pbl-cdk-virtual-scroll-viewport',
  templateUrl: 'virtual-scroll-viewport.component.html',
  styleUrls: [ './virtual-scroll-viewport.component.scss' ],
  host: { // tslint:disable-line:use-host-property-decorator
    class: 'cdk-virtual-scroll-viewport',
    '[class.cdk-virtual-scroll-disabled]': '!enabled',
    '[class.cdk-virtual-scroll-orientation-horizontal]': 'orientation === "horizontal"',
    '[class.cdk-virtual-scroll-orientation-vertical]': 'orientation === "vertical"'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UnRx()
export class PblCdkVirtualScrollViewportComponent extends CdkVirtualScrollViewport implements OnInit, AfterViewInit, OnDestroy {

  get isScrolling(): boolean { return this._isScrolling; }
  readonly enabled: boolean;

  /**
   * Emits the offset (in pixels) of the rendered content every time it changes.
   * The emission is done OUTSIDE of angular (i.e. no change detection cycle is triggered).
   *
   * Note that when not enabled (i.e `NoVirtualScrollStrategy` is used) there are no emissions.
   */
  readonly offsetChange: Observable<number>;

  @Input() minWidth: number;

  @Input() stickyRowHeaderContainer: HTMLElement;
  @Input() stickyRowFooterContainer: HTMLElement;

  /**
   * Event emitted when the scrolling state of rows in the table changes.
   * When scrolling starts `true` is emitted and when the scrolling ends `false` is emitted.
   *
   * The table is in "scrolling" state from the first scroll event and until 2 animation frames
   * have passed without a scroll event.
   *
   * When scrolling, the emitted value is the direction: -1 or 1
   * When not scrolling, the emitted value is 0.
   *
   * NOTE: This event runs outside the angular zone.
   */
  @Output() scrolling = new EventEmitter< -1 | 0 | 1 >();

  /**
   * Emits an estimation of the current frame rate while scrolling, in a 500ms interval.
   *
   * The frame rate value is the average frame rate from all measurements since the scrolling began.
   * To estimate the frame rate, a significant number of measurements is required so value is emitted every 500 ms.
   * This means that a single scroll or short scroll bursts will not result in a `scrollFrameRate` emissions.
   *
   * Valid on when virtual scrolling is enabled.
   *
   * NOTE: This event runs outside the angular zone.
   *
   * In the future the measurement logic might be replaced with the Frame Timing API
   * See:
   * - https://developers.google.com/web/updates/2014/11/frame-timing-api
   * - https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
   * - https://github.com/googlearchive/frame-timing-polyfill/wiki/Explainer
   */
  @Output() scrollFrameRate = new EventEmitter<number>();

  /**
   * The `scrollHeight` of the virtual scroll viewport.
   * The `scrollHeight` is updated by the virtual scroll (update logic and frequency depends on the strategy implementation) through
   * the `setTotalContentSize(size)` method. The input size is used to position a dummy spacer element at a position that mimics the `scrollHeight`.
   *
   * In theory, the size sent to `setTotalContentSize` should equal the `scrollHeight` value, once the browser update's the layout.
   * In reality it does not happen, sometimes they are not equal. Setting a size will result in a different `scrollHeight`.
   * This might be due to changes in measurements when handling sticky meta rows (moving back and forth)
   *
   * Because the position of the dummy spacer element is set through DI the layout will run in the next micro-task after the call to `setTotalContentSize`.
   */
  scrollHeight = 0;

  ngeRenderedContentSize = 0;
  pblFillerHeight: string;

  get wheelMode(): PblCdkVirtualScrollDirective['wheelMode'] {
    return (this.pblScrollStrategy as PblCdkVirtualScrollDirective).wheelMode || this.wheelModeDefault || 'passive';
  }

  get innerWidth(): number {
    const innerWidthHelper = this.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-inner-width') as HTMLElement;
    return innerWidthHelper.getBoundingClientRect().width;
  }

  get outerWidth(): number {
    return this.elementRef.nativeElement.getBoundingClientRect().width;
  }

  get innerHeight(): number {
    const innerWidthHelper = this.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-inner-width') as HTMLElement;
    return innerWidthHelper.getBoundingClientRect().height;
  }

  get outerHeight(): number {
    return this.elementRef.nativeElement.getBoundingClientRect().height;
  }

  /// TODO(shlomiassaf): Remove when not supporting 8.1.2 and below
  /// COMPATIBILITY 8.1.2- <-> 8.1.3+
    /** A string representing the `style.width` property value to be used for the spacer element. */
    _totalContentWidth = '';
    /** A string representing the `style.height` property value to be used for the spacer element. */
   _totalContentHeight = '';
    /**
   * The transform used to scale the spacer to the same size as all content, including content that
   * is not currently rendered.
   * @deprecated
   */
  _totalContentSizeTransform = '';
 /// COMPATIBILITY 8.1.2- <-> 8.1.3+

  private offsetChange$ = new Subject<number>();
  private offset: number;
  private isCDPending: boolean;
  private _isScrolling = false;

  private wheelModeDefault:  PblCdkVirtualScrollDirective['wheelMode'];

  constructor(elementRef: ElementRef<HTMLElement>,
              private cdr: ChangeDetectorRef,
              ngZone: NgZone,
              config: PblNgridConfigService,
              @Optional() @Inject(VIRTUAL_SCROLL_STRATEGY) public pblScrollStrategy: VirtualScrollStrategy,
              @Optional() dir: Directionality,
              scrollDispatcher: ScrollDispatcher,
              pluginCtrl: PblNgridPluginController,
              private table: PblNgridComponent<any>) {
    super(elementRef,
          cdr,
          ngZone,
          pblScrollStrategy = resolveScrollStrategy(config, pblScrollStrategy),
          dir,
          scrollDispatcher);

    if (config.has('virtualScroll')) {
      this.wheelModeDefault = config.get('virtualScroll').wheelMode;
    }
    config.onUpdate('virtualScroll').pipe(UnRx(this)).subscribe( change => this.wheelModeDefault = change.curr.wheelMode);

    if (pblScrollStrategy instanceof PblCdkVirtualScrollDirective) {
      this.enabled = pblScrollStrategy.type !== 'vScrollNone';
    } else {
      this.enabled = !(pblScrollStrategy instanceof NoVirtualScrollStrategy);
    }
    pluginCtrl.extApi.setViewport(this);
    this.offsetChange = this.offsetChange$.asObservable();
  }

  ngOnInit(): void {
    if (this.enabled) {
      super.ngOnInit();
    } else {
      CdkScrollable.prototype.ngOnInit.call(this);
    }
    this.ngZone.runOutsideAngular( () => this.initScrollWatcher() );
  }

  ngAfterViewInit(): void {
    // If virtual scroll is disabled (`NoVirtualScrollStrategy`) we need to disable any effect applied
    // by the viewport, wrapping the content injected to it.
    // The main effect is the table having height 0 at all times, unless the height is explicitly set.
    // This happens because the content taking out of the layout, wrapped in absolute positioning.
    // Additionally, the host itself (viewport) is set to contain: strict.
    const { table } = this;
    if (this.enabled) {
      table._cdkTable.attachViewPort();
    }

    this.scrolling
      .pipe(UnRx(this))
      .subscribe( isScrolling => {
        this._isScrolling = !!isScrolling;
        if (isScrolling) {
          table.addClass('pbl-ngrid-scrolling');
        } else {
          table.removeClass('pbl-ngrid-scrolling');
        }
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.offsetChange$.complete();
  }

  setTotalContentSize(size: number) {
    super.setTotalContentSize(size);

    // TODO(shlomiassaf)[perf, 3]: run this once... (aggregate all calls within the same animation frame)
    requestAnimationFrame(() => {
      this.scrollHeight = this.elementRef.nativeElement.scrollHeight; //size;
      this.updateFiller();
      // We must trigger a change detection cycle because the filler div element is updated through bindings
      this.cdr.markForCheck();
    })
  }

  checkViewportSize() {
    // TODO: Check for changes in `CdkVirtualScrollViewport` source code, when resizing is handled!
    // see https://github.com/angular/material2/blob/28fb3abe77c5336e4739c820584ec99c23f1ae38/src/cdk/scrolling/virtual-scroll-viewport.ts#L341
    const prev = this.getViewportSize();
    super.checkViewportSize();
    if (prev !== this.getViewportSize()) {
      this.updateFiller();
    }
  }

  /** Measure the combined size of all of the rendered items. */
  measureRenderedContentSize(): number {
    let size = super.measureRenderedContentSize();
    if (this.orientation === 'vertical') {
      size -= this.stickyRowHeaderContainer.offsetHeight + this.stickyRowFooterContainer.offsetHeight;

      // Compensate for hz scroll bar, if exists, only in non virtual scroll mode.
      if (!this.enabled) {
        size += this.outerHeight - this.innerHeight;
      }
    }
    return this.ngeRenderedContentSize = size;
  }

  private updateFiller(): void {
    this.measureRenderedContentSize();
    if (this.table.noFiller) {
      this.pblFillerHeight = undefined;
    } else {
      this.pblFillerHeight = this.getViewportSize() >= this.ngeRenderedContentSize ?
        `calc(100% - ${this.ngeRenderedContentSize}px)`
        : undefined
      ;
    }
  }

  onSourceLengthChange(prev: number, curr: number): void {
    this.checkViewportSize();
    this.updateFiller();
  }

  attach(forOf: CdkVirtualForOf<any> & NgeVirtualTableRowInfo) {
    super.attach(forOf);
    const scrollStrategy = this.pblScrollStrategy instanceof PblCdkVirtualScrollDirective
      ? this.pblScrollStrategy._scrollStrategy
      : this.pblScrollStrategy
    ;
    if (scrollStrategy instanceof TableAutoSizeVirtualScrollStrategy) {
      scrollStrategy.averager.setRowInfo(forOf);
    }
  }

  setRenderedContentOffset(offset: number, to: 'to-start' | 'to-end' = 'to-start') {
    super.setRenderedContentOffset(offset, to);
    if (this.enabled) {
      if (this.offset !== offset) {
        this.offset = offset;
        if (!this.isCDPending) {
          this.isCDPending = true;

          const syncTransform = () => { };

          this.ngZone.runOutsideAngular(() => Promise.resolve()
            .then( () => syncTransform() )
            .then( () => {
              this.isCDPending = false;
              this.offsetChange$.next(this.offset);
            })
          );
        }
      }
    }
  }

  /**
   * Init the scrolling watcher which track scroll events an emits `scrolling` and `scrollFrameRate` events.
   */
  private initScrollWatcher(): void {
    let scrolling = 0;
    let lastOffset = this.measureScrollOffset();
    this.elementScrolled()
      .subscribe(() => {
        /*  `scrolling` is a boolean flag that turns on with the first `scroll` events and ends after 2 browser animation frames have passed without a `scroll` event.
            This is an attempt to detect a scroll end event, which does not exist.

            `scrollFrameRate` is a number that represent a rough estimation of the frame rate by measuring the time passed between each request animation frame
            while the `scrolling` state is true. The frame rate value is the average frame rate from all measurements since the scrolling began.
            To estimate the frame rate, a significant number of measurements is required so value is emitted every 500 ms.
            This means that a single scroll or short scroll bursts will not result in a `scrollFrameRate` emissions.

        */
        if (scrolling === 0) {
          /*  The measure array holds values required for frame rate measurements.
              [0] Storage for last timestamp taken
              [1] The sum of all measurements taken (a measurement is the time between 2 snapshots)
              [2] The count of all measurements
              [3] The sum of all measurements taken WITHIN the current buffer window. This buffer is flushed into [1] every X ms (see buggerWindow const).
          */
          const bufferWindow = 499;
          const measure = [ performance.now(), 0, 0, 0 ];
          const offset = this.measureScrollOffset();
          if (lastOffset === offset) { return; }
          const delta = lastOffset < offset ? 1 : -1;

          this.scrolling.next(delta);

          const raf = () => {
            const time = -measure[0] + (measure[0] = performance.now());
            if (time > 5) {
              measure[1] += time;
              measure[2] += 1;
            }
            if (scrolling === -1) {
              scrolling = 0;
              lastOffset = this.measureScrollOffset();
              this.scrolling.next(0);
            }
            else {
              if (measure[1] > bufferWindow) {
                measure[3] += measure[1];
                measure[1] = 0;
                this.scrollFrameRate.emit(1000 / (measure[3]/measure[2]));
              }
              scrolling = scrolling === 1 ? -1 : 1;
              requestAnimationFrame(raf);
            }
          };
          requestAnimationFrame(raf);
        }
        scrolling++;
      });
  }
}

declare global {
  interface CSSStyleDeclaration {
    contain: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' | 'inherit' | 'initial' | 'unset';
  }
}
