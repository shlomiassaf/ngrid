import { animationFrameScheduler, Subscription } from 'rxjs';
import { auditTime, take } from 'rxjs/operators';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  Optional,
  OnDestroy,
  NgZone,
  ViewEncapsulation
} from '@angular/core';

import { Directionality } from '@angular/cdk/bidi';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { DragRefConfig, DragDropRegistry, CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';

import { PblNgridComponent, PblColumn, PblNgridMetaCellContext, NgridPlugin, isPblColumn } from '@pebula/ngrid';
import { toggleNativeDragInteractions } from './cdk-encapsulated-code';
import { extendGrid } from './extend-grid';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    columnResize?: PblNgridDragResizeComponent;
  }
}

export const PLUGIN_KEY: 'columnResize' = 'columnResize';

/** Options that can be used to bind a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({passive: true});

/** Options that can be used to bind an active event listener. */
const activeEventListenerOptions = normalizePassiveListenerOptions({passive: false});

@NgridPlugin({ id: PLUGIN_KEY, runOnce: extendGrid })
@Component({
  selector: 'pbl-ngrid-drag-resize', // tslint:disable-line:component-selector
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'pbl-ngrid-column-resizer',
    '[style.width.px]': 'grabAreaWidth',
  },
  templateUrl: './column-resize.component.html',
  styleUrls: [ './column-resize.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridDragResizeComponent implements AfterViewInit, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input() set context(value: PblNgridMetaCellContext<any>) {
    if (value) {
      const { col, grid } = value;
      if (isPblColumn(col)) {
        this.column = col;
        this.grid = grid;
        return;
      }
    }
    this.column = this.grid = undefined;
  }

  /**
   * The area (in pixels) in which the handle can be grabbed and resize the cell.
   * Default: 6
   */
  @Input() grabAreaWidth = 6;

  column: PblColumn;
  /** @deprecated use grid instead */
  get table(): PblNgridComponent<any> { return this.grid; }
  grid: PblNgridComponent<any>;

  _hasStartedDragging: boolean;
  private _hasMoved: boolean;
  private _rootElement: HTMLElement;
  private _pointerMoveSubscription = Subscription.EMPTY;
  private _pointerUpSubscription = Subscription.EMPTY;
  private _scrollPosition: {top: number, left: number};
  private _pickupPositionOnPage: Point;
  private _initialWidth: number;
  private _lastWidth: number;

  private _rootElementInitSubscription = Subscription.EMPTY;

  constructor(public element: ElementRef<HTMLElement>,
              private _ngZone: NgZone,
              private _viewportRuler: ViewportRuler,
              private _dragDropRegistry: DragDropRegistry<PblNgridDragResizeComponent, any>,
              @Inject(CDK_DRAG_CONFIG) private _config: DragRefConfig,
              @Optional() private _dir: Directionality) {
    _dragDropRegistry.registerDragItem(this);
  }

  ngAfterViewInit(): void {
    // We need to wait for the zone to stabilize, in order for the reference
    // element to be in the proper place in the DOM. This is mostly relevant
    // for draggable elements inside portals since they get stamped out in
    // their original DOM position and then they get transferred to the portal.
    this._rootElementInitSubscription = this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      const rootElement = this._rootElement = this._getRootElement();
      const cell = rootElement.parentElement;
      cell.classList.add('pbl-ngrid-column-resize');
      rootElement.addEventListener('mousedown', this._pointerDown, activeEventListenerOptions);
      rootElement.addEventListener('touchstart', this._pointerDown, passiveEventListenerOptions);
      toggleNativeDragInteractions(rootElement , false);
    });
  }

  ngOnDestroy(): void {
    if (this._rootElement) {
      this._rootElement.removeEventListener('mousedown', this._pointerDown, activeEventListenerOptions);
      this._rootElement.removeEventListener('touchstart', this._pointerDown, passiveEventListenerOptions);
    }
    this._rootElementInitSubscription.unsubscribe();
    this._dragDropRegistry.removeDragItem(this);
    this._removeSubscriptions();
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    this.grid.columnApi.autoSizeColumn(this.column);
  }

  _pointerDown = (event: MouseEvent | TouchEvent) => {
    this._initializeDragSequence(this._rootElement, event);
  }

    /**
   * Sets up the different variables and subscriptions
   * that will be necessary for the dragging sequence.
   * @param referenceElement Element that started the drag sequence.
   * @param event Browser event object that started the sequence.
   */
  private _initializeDragSequence(referenceElement: HTMLElement, event: MouseEvent | TouchEvent) {
    // Always stop propagation for the event that initializes
    // the dragging sequence, in order to prevent it from potentially
    // starting another sequence for a draggable parent somewhere up the DOM tree.
    event.stopPropagation();

    // Abort if the user is already dragging or is using a mouse button other than the primary one.
    if (this._isDragging() || (!this._isTouchEvent(event) && event.button !== 0)) {
      return;
    }

    this._hasStartedDragging = this._hasMoved = false;
    this._pointerMoveSubscription = this._dragDropRegistry.pointerMove
      .pipe(auditTime(0, animationFrameScheduler))
      .subscribe(this._pointerMove);
    this._pointerUpSubscription = this._dragDropRegistry.pointerUp.subscribe(this._pointerUp);
    this._scrollPosition = this._viewportRuler.getViewportScrollPosition();

    this._pickupPositionOnPage = this._getPointerPositionOnPage(event);
    this._dragDropRegistry.startDragging(this, event);
  }

  /** Handler that is invoked when the user moves their pointer after they've initiated a drag. */
  private _pointerMove = (event: MouseEvent | TouchEvent) => {
    const pointerPosition = this._getPointerPositionOnPage(event);
    const distanceX = pointerPosition.x - this._pickupPositionOnPage.x;
    const distanceY = pointerPosition.y - this._pickupPositionOnPage.y;

    if (!this._hasStartedDragging) {
      // Only start dragging after the user has moved more than the minimum distance in either
      // direction. Note that this is preferable over doing something like `skip(minimumDistance)`
      // in the `pointerMove` subscription, because we're not guaranteed to have one move event
      // per pixel of movement (e.g. if the user moves their pointer quickly).
      if (Math.abs(distanceX) + Math.abs(distanceY) >= this._config.dragStartThreshold) {
        this._hasStartedDragging = true;

        // It will be a good thing if we turned of the header's resize observer to boost performance
        // However, because we relay on the total grid minimum width updates to relatively even out the columns it will not work.
        // Group cells will not cover all of the children, when we enlarge the width of a child in the group.
        // This is because the max-width of the group is set proportional to the total min-width of the inner grid.
        // For it to work we need to directly update the width of ALL OF THE GROUPS.
        // this.column.columnDef.isDragging = true;

        this.column.sizeInfo.updateSize();
        this._lastWidth = this._initialWidth = this.column.columnDef.netWidth;
      }
      return;
    }

    this._hasMoved = true;
    event.preventDefault();
    event.stopPropagation();

    let newWidth = Math.max(0, this._initialWidth + distanceX);

    if (newWidth > this.column.maxWidth) {
      newWidth = this.column.maxWidth;
    } else if (distanceX < 0 && newWidth < this.column.minWidth) {
      newWidth = this.column.minWidth;
    }

    if (this._lastWidth !== newWidth) {
      this._lastWidth = newWidth;
      this.column.updateWidth(`${newWidth}px`);
      this.grid.resetColumnsWidth();
      // `this.column.updateWidth` will update the grid width cell only, which will trigger a resize that will update all other cells
      // `this.grid.resetColumnsWidth()` will re-adjust all other grid width cells, and if their size changes they will trigger the resize event...
    }
  }

  /** Handler that is invoked when the user lifts their pointer up, after initiating a drag. */
  private _pointerUp = () => {
    if (!this._isDragging()) {
      return;
    }

    this._removeSubscriptions();
    this._dragDropRegistry.stopDragging(this);

    if (!this._hasStartedDragging) {
      return;
    }

    // this.column.columnDef.isDragging = false;
    this.grid.columnApi.resizeColumn(this.column, this._lastWidth + 'px');
  }

  private _getPointerPositionOnPage(event: MouseEvent | TouchEvent): Point {
    const point = this._isTouchEvent(event) ? event.touches[0] : event;

    return {
      x: point.pageX - this._scrollPosition.left,
      y: point.pageY - this._scrollPosition.top
    };
  }

  private _isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
  }

  _isDragging() {
    return this._dragDropRegistry.isDragging(this);
  }

  private _getRootElement(): HTMLElement {
    return this.element.nativeElement;
  }
  private _removeSubscriptions() {
    this._pointerMoveSubscription.unsubscribe();
    this._pointerUpSubscription.unsubscribe();
  }
}

interface Point {
  x: number;
  y: number;
}
