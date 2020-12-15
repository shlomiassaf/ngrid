import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation,
  NgZone,
  Output,
  Optional,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { Directionality } from '@angular/cdk/bidi';
import { ListRange } from '@angular/cdk/collections';
import {
  CdkVirtualScrollViewport,
  VIRTUAL_SCROLL_STRATEGY,
  ScrollDispatcher,
  CdkVirtualForOf,
  ViewportRuler,
} from '@angular/cdk/scrolling';
import { PblNgridConfigService, unrx } from '@pebula/ngrid/core';

import { PblNgridComponent } from '../../ngrid.component';
import { PblNgridBaseVirtualScrollDirective } from './strategies/base-v-scroll.directive'
import { PblNgridVirtualScrollStrategy } from './strategies/types';
import { NgeVirtualTableRowInfo, PblVirtualScrollForOf } from './virtual-scroll-for-of';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../../ext/grid-ext-api';
import { createScrollWatcherFn } from './scroll-logic/virtual-scroll-watcher';
import { PblNgridAutoSizeVirtualScrollStrategy } from './strategies/cdk-wrappers/auto-size';
import { RowIntersectionTracker } from './row-intersection';
import { resolveScrollStrategy } from './utils';
import { VirtualScrollHightPaging } from './virtual-scroll-height-paging';

declare module '@pebula/ngrid/core/lib/configuration/type' {
  interface PblNgridConfig {
    virtualScroll?: {
      wheelMode?: PblNgridBaseVirtualScrollDirective['wheelMode'];
      defaultStrategy?(): PblNgridVirtualScrollStrategy;
    }
  }
}

export const DISABLE_INTERSECTION_OBSERVABLE = new InjectionToken<boolean>('When found in the DI tree and resolves to true, disable the use of IntersectionObserver');
const APP_DEFAULT_VIRTUAL_SCROLL_STRATEGY = () => new PblNgridAutoSizeVirtualScrollStrategy(100, 200);

@Component({
  selector: 'pbl-cdk-virtual-scroll-viewport',
  templateUrl: 'virtual-scroll-viewport.component.html',
  styleUrls: [ './virtual-scroll-viewport.component.scss' ],
  host: { // tslint:disable-line: no-host-metadata-property
    class: 'cdk-virtual-scroll-viewport',
    '[class.cdk-virtual-scroll-disabled]': '!enabled',
    '[class.cdk-virtual-scroll-orientation-horizontal]': 'orientation === "horizontal"',
    '[class.cdk-virtual-scroll-orientation-vertical]': 'orientation === "vertical"'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PblCdkVirtualScrollViewportComponent extends CdkVirtualScrollViewport implements OnInit, AfterViewInit, OnDestroy {

  get isScrolling(): boolean { return this._isScrolling; }
  readonly enabled: boolean;

  /** @internal */
  @ViewChild('innerBoxHelper', { static: true }) _innerBoxHelper: ElementRef<HTMLElement>;

  /**
   * Emits the offset (in pixels) of the rendered content every time it changes.
   * The emission is done OUTSIDE of angular (i.e. no change detection cycle is triggered).
   *
   * Note that when not enabled (i.e `NoVirtualScrollStrategy` is used) there are no emissions.
   */
  readonly offsetChange: Observable<number>;

  @Input() stickyRowHeaderContainer: HTMLElement;
  @Input() stickyRowFooterContainer: HTMLElement;

  /**
   * Event emitted when the scrolling state of rows in the grid changes.
   * When scrolling starts `true` is emitted and when the scrolling ends `false` is emitted.
   *
   * The grid is in "scrolling" state from the first scroll event and until 2 animation frames
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

  get wheelMode(): PblNgridBaseVirtualScrollDirective['wheelMode'] {
    return (this.pblScrollStrategy as PblNgridBaseVirtualScrollDirective).wheelMode || this.wheelModeDefault || 'passive';
  }

  /**
   * Get the current bounding client rectangle boxes for the virtual scroll container
   * Since performing these measurements impact performance the values are are cached between request animation frames.
   * I.E 2 subsequent measurements will always return the same value, the next measurement will only take place after
   * the next animation frame (using `requestAnimationFrame` API)
   */
  get getBoundingClientRects(): { clientRect: DOMRect; innerWidth: number; innerHeight: number; scrollBarWidth: number; scrollBarHeight: number; } {
    if (!this._boundingClientRects) {
      const innerBox = this._innerBoxHelper.nativeElement.getBoundingClientRect();
      const clientRect = this.element.getBoundingClientRect();
      this._boundingClientRects = {
        clientRect,
        innerWidth: innerBox.width,
        innerHeight: innerBox.height,
        scrollBarWidth: clientRect.width - innerBox.width,
        scrollBarHeight: clientRect.height - innerBox.height,
      }

      const resetCurrentBox = () => this._boundingClientRects = undefined;
      if (this._isScrolling) {
        this.scrolling.pipe(filter(scrolling => scrolling === 0), take(1)).subscribe(resetCurrentBox);
      } else {
        requestAnimationFrame(resetCurrentBox);
      }
    }

    return this._boundingClientRects;
  }

  get innerWidth(): number {
    return this.getBoundingClientRects.innerWidth;
  }

  get outerWidth(): number {
    return this.getBoundingClientRects.clientRect.width;
  }

  get innerHeight(): number {
    return this.getBoundingClientRects.innerWidth;
  }

  get outerHeight(): number {
    return this.getBoundingClientRects.clientRect.height;
  }

  get scrollWidth(): number {
    return this.element.scrollWidth;
  }

  /**
   * When true, the virtual paging feature is enabled because the virtual content size exceed the supported height of the browser so paging is enable.
   */
  get virtualPagingActive() { return this.heightPaging?.active ?? false; }

  readonly intersection: RowIntersectionTracker;
  readonly element: HTMLElement;
  readonly _minWidth$: Observable<number>;

  private offsetChange$ = new Subject<number>();
  private offset = 0;
  private isCDPending: boolean;
  private _isScrolling = false;

  private wheelModeDefault:  PblNgridBaseVirtualScrollDirective['wheelMode'];
  private grid: PblNgridComponent<any>;
  private forOf?: PblVirtualScrollForOf<any>;
  private _boundingClientRects: PblCdkVirtualScrollViewportComponent['getBoundingClientRects'];
  private heightPaging: VirtualScrollHightPaging;

  constructor(elRef: ElementRef<HTMLElement>,
              private cdr: ChangeDetectorRef,
              ngZone: NgZone,
              config: PblNgridConfigService,
              @Optional() @Inject(VIRTUAL_SCROLL_STRATEGY) public pblScrollStrategy: PblNgridVirtualScrollStrategy,
              @Optional() dir: Directionality,
              scrollDispatcher: ScrollDispatcher,
              viewportRuler: ViewportRuler,
              @Inject(EXT_API_TOKEN) private extApi: PblNgridInternalExtensionApi,
              @Optional() @Inject(DISABLE_INTERSECTION_OBSERVABLE) disableIntersectionObserver?: boolean) {
    super(elRef,
          cdr,
          ngZone,
            // TODO: Replace with `PblNgridDynamicVirtualScrollStrategy` in v4
          pblScrollStrategy = resolveScrollStrategy(config, pblScrollStrategy, APP_DEFAULT_VIRTUAL_SCROLL_STRATEGY),
          dir,
          scrollDispatcher,
          viewportRuler);
    this.element = elRef.nativeElement;
    this.grid = extApi.grid;

    if (config.has('virtualScroll')) {
      this.wheelModeDefault = config.get('virtualScroll').wheelMode;
    }
    config.onUpdate('virtualScroll').pipe(unrx(this)).subscribe( change => this.wheelModeDefault = change.curr.wheelMode);

    this.enabled = pblScrollStrategy.type && pblScrollStrategy.type !== 'vScrollNone';

    extApi.setViewport(this);
    this.offsetChange = this.offsetChange$.asObservable();

    this._minWidth$ = this.grid.columnApi.totalColumnWidthChange;

    this.intersection = new RowIntersectionTracker(this.element, !!disableIntersectionObserver || true);
  }

  ngOnInit(): void {
    this.pblScrollStrategy.attachExtApi(this.extApi);
    if (this.enabled) {
      // Enabling virtual scroll event with browser height limit
      // Based on: http://jsfiddle.net/SDa2B/263/
      this.heightPaging = new VirtualScrollHightPaging(this);
    }
    super.ngOnInit();

    // Init the scrolling watcher which track scroll events an emits `scrolling` and `scrollFrameRate` events.
    this.ngZone.runOutsideAngular( () => this.elementScrolled().subscribe(createScrollWatcherFn(this)) );
  }

  ngAfterViewInit(): void {
    // If virtual scroll is disabled (`NoVirtualScrollStrategy`) we need to disable any effect applied
    // by the viewport, wrapping the content injected to it.
    // The main effect is the grid having height 0 at all times, unless the height is explicitly set.
    // This happens because the content taking out of the layout, wrapped in absolute positioning.
    // Additionally, the host itself (viewport) is set to contain: strict.
    const { grid } = this;
    if (this.enabled) {
      this.forOf = new PblVirtualScrollForOf<any>(this.extApi, this.ngZone);
      if (!this.heightPaging.active) {
        this.forOf.wheelControl.wheelListen();
      }

      // `wheel` mode does not work well with the workaround to fix height limit, so we disable it when it's on
      this.heightPaging.activeChanged
        .subscribe( () => {
          if (this.heightPaging.active) {
            this.forOf.wheelControl.wheelUnListen();
          } else {
            this.forOf.wheelControl.wheelListen();
          }
        });
    }

    this.scrolling
      .pipe(unrx(this))
      .subscribe( isScrolling => {
        this._isScrolling = !!isScrolling;
        if (isScrolling) {
          grid.addClass('pbl-ngrid-scrolling');
        } else {
          grid.removeClass('pbl-ngrid-scrolling');
        }
      });
  }

  ngOnDestroy(): void {
    this.intersection.destroy();
    this.heightPaging?.dispose();
    super.ngOnDestroy();
    this.detachViewPort();
    this.offsetChange$.complete();
    unrx.kill(this);
  }

  reMeasureCurrentRenderedContent() {
    this.pblScrollStrategy.onContentRendered();
  }

  measureScrollOffset(from?: 'top' | 'left' | 'right' | 'bottom' | 'start' | 'end'): number {
    const scrollOffset = super.measureScrollOffset(from);
    return (!from || from === 'top') && this.heightPaging ? this.heightPaging.transformScrollOffset(scrollOffset) : scrollOffset;
  }

  getOffsetToRenderedContentStart(): number | null {
    const renderedContentStart = super.getOffsetToRenderedContentStart();
    return this.heightPaging?.transformOffsetToRenderedContentStart(renderedContentStart) ?? renderedContentStart;
  }

  setRenderedContentOffset(offset: number, to: 'to-start' | 'to-end' = 'to-start') {
    if (this.heightPaging) {
      offset = this.heightPaging.transformRenderedContentOffset(offset, to);
    }
    super.setRenderedContentOffset(offset, to);
    if (this.enabled) {
      if (this.offset !== offset) {
        this.offset = offset;
        if (!this.isCDPending) {
          this.isCDPending = true;

          this.ngZone.runOutsideAngular(() => Promise.resolve()
            .then( () => {
              this.isCDPending = false;
              this.offsetChange$.next(this.offset);
            })
          );
        }
      }
    }
  }

  setTotalContentSize(size: number) {
    if (this.heightPaging) {
      size = this.heightPaging.transformTotalContentSize(size, super.measureScrollOffset());
    }
    super.setTotalContentSize(size);

    // TODO(shlomiassaf)[perf, 3]: run this once... (aggregate all calls within the same animation frame)
    requestAnimationFrame(() => {
      this.scrollHeight = this.element.scrollHeight; //size;
      this.updateFiller();
      // We must trigger a change detection cycle because the filler div element is updated through bindings
      this.cdr.markForCheck();
    })
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

  checkViewportSize() {
    // TODO: Check for changes in `CdkVirtualScrollViewport` source code, when resizing is handled!
    // see https://github.com/angular/material2/blob/28fb3abe77c5336e4739c820584ec99c23f1ae38/src/cdk/scrolling/virtual-scroll-viewport.ts#L341
    const prev = this.getViewportSize();
    super.checkViewportSize();
    if (prev !== this.getViewportSize()) {
      this.updateFiller();
    }
  }

  detachViewPort(): void {
    if (this.forOf) {
      this.forOf.destroy();
      this.forOf = undefined;
    }
  }

  /**
   * TODO(REFACTOR_REF 1): Move to use rowApi so we can accept rows/cells and not html elements.
   * It will allow us to bring into view rows as well.
   * This will change the methods signature!
   * @internal
   */
  _scrollIntoView(cellElement: HTMLElement) {
    const container = this.element;
    const elBox = cellElement.getBoundingClientRect();
    const containerBox = this.getBoundingClientRects.clientRect;

    // Vertical handling.
    // We have vertical virtual scroll, so here we use the virtual scroll API to scroll into the target
    if (elBox.top < containerBox.top) { // out from top
      const offset = elBox.top - containerBox.top;
      this.scrollToOffset(this.measureScrollOffset() + offset);
    } else if (elBox.bottom > containerBox.bottom) { // out from bottom
      const offset = elBox.bottom - (containerBox.bottom - this.getScrollBarThickness('horizontal'));
      this.scrollToOffset(this.measureScrollOffset() + offset);
    }

    // Horizontal handling.
    // We DON'T have horizontal virtual scroll, so here we use the DOM API to scroll into the target
    // TODO: When implementing horizontal virtual scroll, refactor this as well.
    if (elBox.left < containerBox.left) { // out from left
      const offset = elBox.left - containerBox.left;
      container.scroll(container.scrollLeft + offset, container.scrollTop);
    } else if (elBox.right > containerBox.right) { // out from right
      const offset = elBox.right - (containerBox.right - this.getScrollBarThickness('vertical'));
      container.scroll(container.scrollLeft + offset, container.scrollTop);
    }
  }

  onSourceLengthChange(prev: number, curr: number): void {
    this.checkViewportSize();
    this.updateFiller();
  }

  attach(forOf: CdkVirtualForOf<any> & NgeVirtualTableRowInfo) {
    super.attach(forOf);
    const scrollStrategy = this.pblScrollStrategy instanceof PblNgridBaseVirtualScrollDirective
      ? this.pblScrollStrategy._scrollStrategy
      : this.pblScrollStrategy
    ;
    if (scrollStrategy instanceof PblNgridAutoSizeVirtualScrollStrategy) {
      scrollStrategy.averager.setRowInfo(forOf);
    }
  }

  setRenderedRange(range: ListRange) {
    super.setRenderedRange(range);
  }

  getScrollBarThickness(location: 'horizontal' | 'vertical') {
    switch (location) {
      case 'horizontal':
        return this.outerHeight - this.innerHeight;
      case 'vertical':
        return this.outerWidth - this.innerWidth;
    }
  }

  private updateFiller(): void {
    this.measureRenderedContentSize();
    if (this.grid.noFiller) {
      this.pblFillerHeight = undefined;
    } else {
      this.pblFillerHeight = this.getViewportSize() >= this.ngeRenderedContentSize ?
        `calc(100% - ${this.ngeRenderedContentSize}px)`
        : undefined
      ;
    }
  }

}

declare global {
  interface CSSStyleDeclaration {
    contain: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'style' | 'paint' | 'inherit' | 'initial' | 'unset';
  }
}
