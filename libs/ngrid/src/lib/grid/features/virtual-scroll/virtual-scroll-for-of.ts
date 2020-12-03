import { Observable, Subject, fromEvent, race, timer } from 'rxjs';
import { filter, startWith, pairwise, take, takeUntil, map, debounceTime } from 'rxjs/operators';

import { NgZone, ViewContainerRef } from '@angular/core';
import { CollectionViewer, ListRange } from '@angular/cdk/collections';

import { PblNgridInternalExtensionApi } from '../../../ext/grid-ext-api';
import { PblNgridComponent } from '../../ngrid.component';
import { PblDataSource } from '../../../data-source/data-source';
import { PblCdkTableComponent } from '../../pbl-cdk-table/pbl-cdk-table.component';
import { PblCdkVirtualScrollViewportComponent } from './virtual-scroll-viewport.component';
import { splitRange, updateStickyRows, measureRangeSize } from './utils';
import { MetaRowStickyScroll } from './meta-row-sticky-scroll';

const FIXED_HEADER_MODE = true;

function sortByIndex(a: { index: number }, b: { index: number }) { return a.index - b.index };

export interface NgeVirtualTableRowInfo {
  readonly headerLength: number;
  readonly rowLength: number;
  readonly footerLength: number;
}

export class PblVirtualScrollForOf<T> implements CollectionViewer, NgeVirtualTableRowInfo {
  viewChange: Observable<ListRange>;

  dataStream: Observable<T[] | ReadonlyArray<T>>;

  get headerLength(): number { return this.header.rows.length  }
  get rowLength(): number { return this.vcRefs.data.length  }
  get footerLength(): number { return this.footer.rows.length  }

  readonly wheelControl: { wheelListen: () => void; wheelUnListen: () => void; readonly listening: boolean; };

  private destroyed = new Subject<void>();
  private ds: PblDataSource<T>;

  private get vcRefs(): Record<'header' | 'data' | 'footer', ViewContainerRef> {
    const value = {
      header: this.cdkTable._headerRowOutlet.viewContainer,
      data: this.cdkTable._rowOutlet.viewContainer,
      footer: this.cdkTable._footerRowOutlet.viewContainer,
    };
    Object.defineProperty(this, 'vcRefs', { value, configurable: true });
    return value;
  }

  private renderedContentOffset = 0;
  /** A tuple containing the last known ranges [header, data, footer] */
  private _renderedRanges: [ListRange, ListRange, ListRange];
  /** The length of meta rows [0] = header [1] = footer */
  private metaRows: [number, number] = [0, 0];

  private header = { rows: [] as HTMLElement[], sticky: [] as boolean[], rendered: [] as boolean[] };
  private footer = { rows: [] as HTMLElement[], sticky: [] as boolean[], rendered: [] as boolean[] };

  private grid: PblNgridComponent<T>;
  private cdkTable: PblCdkTableComponent<T>;
  private viewport: PblCdkVirtualScrollViewportComponent;

  constructor(extApi: PblNgridInternalExtensionApi<T>, private ngZone: NgZone) {
    this.grid = extApi.grid;
    this.cdkTable = extApi.cdkTable;
    this.viewport = extApi.viewport;

    this.viewChange = this.cdkTable.viewChange;

    extApi.events
      .pipe( takeUntil(this.destroyed) )
      .subscribe( event => {
        if (event.kind === 'onDataSource') {
          this.detachView();
          this.attachView(event.curr);
        }
      });
    this.attachView(extApi.grid.ds);

    extApi.metaRowService.sync
      .pipe( takeUntil(this.destroyed) )
      .subscribe( () => {
        const headers = extApi.metaRowService.header.row.concat(extApi.metaRowService.header.sticky).sort(sortByIndex);
        const footers = extApi.metaRowService.footer.row.concat(extApi.metaRowService.footer.sticky).sort(sortByIndex);

        this.header.rows = headers.map( h => h.el );
        this.header.sticky = headers.map( h => h.rowDef.type === 'sticky' );
        this.footer.rows = footers.map( h => h.el );
        this.footer.sticky = footers.map( h => h.rowDef.type === 'sticky' );

        updateStickyRows(this.renderedContentOffset, this.header.rows, this.header.sticky, 'top');
        updateStickyRows(this.renderedContentOffset, this.footer.rows, this.footer.sticky, 'bottom');
      });

    this.viewport.offsetChange
      .pipe( takeUntil(this.destroyed) )
      .subscribe( offset => {
        if (this.renderedContentOffset !== offset) {
          this.renderedContentOffset = offset;
          updateStickyRows(offset, this.header.rows, this.header.sticky, 'top');
          updateStickyRows(offset, this.footer.rows, this.footer.sticky, 'bottom');
        }
      });

    this.wheelControl = this.initWheelControl();
  }

  /**
   * Measures the combined size (width for horizontal orientation, height for vertical) of all items
   * in the specified range. Throws an error if the range includes items that are not currently
   * rendered.
   */
  measureRangeSize(range: ListRange, orientation: 'horizontal' | 'vertical'): number {
    if (range.start >= range.end) {
      return 0;
    }

    const renderedRanges = this._renderedRanges;
    const ranges = splitRange(range, this.metaRows[0], this.ds.length);
    const stickyStates = [ this.header.sticky, [], this.footer.sticky ];

    const vcRefs = [this.vcRefs.header, this.vcRefs.data, this.vcRefs.footer];
    const vcRefSizeReducer = (total: number, vcRef: ViewContainerRef, index: number): number => {
      return total + measureRangeSize(vcRef, ranges[index], renderedRanges[index], stickyStates[index]);
    };

    return vcRefs.reduce(vcRefSizeReducer, 0);
  }

  destroy(): void {
    this.detachView();
    this.destroyed.next();
    this.destroyed.complete();
  }

  private initWheelControl() {
    let listening = false;
    let offset = 0;
    const viewPort = this.viewport.element;
    const metaRowStickyScroll = new MetaRowStickyScroll(this.viewport, viewPort, { header: this.header, footer: this.footer });
    let scrollPosition: number;

    const wheelListen = () => {
      if (!listening) {
        viewPort.addEventListener('wheel', handler, true);
        listening = true;
      }
    };
    const wheelUnListen = () => {
      if (listening) {
        viewPort.removeEventListener('wheel', handler, true);
        listening = false;
      }
    };
    const updateScrollPosition = () => scrollPosition = (this.viewport.measureScrollOffset()) / (this.viewport.scrollHeight - this.viewport.getViewportSize());
    const scrollEnd$ = this.viewport.scrolling.pipe(filter( s => !s ));

    const handler = (event: WheelEvent) => {
      if (event.deltaY) {
        if ( (scrollPosition === 1 && event.deltaY > 0) || (offset === 0 && event.deltaY < 0)) {
          return;
        }
        let newOffset = offset + event.deltaY;
        newOffset = Math.min(this.viewport.scrollHeight, Math.max(0, newOffset));

        if (newOffset !== offset) {
          offset = newOffset;
          if (metaRowStickyScroll.canMove() && metaRowStickyScroll.move(event.deltaY, viewPort.getBoundingClientRect())) {

            const restore = () => {
              metaRowStickyScroll.restore(this.renderedContentOffset);
              updateScrollPosition();
            };

            switch (this.viewport.wheelMode) {
              case 'passive':
                wheelUnListen();
                this.viewport.scrolling
                  .pipe(
                    debounceTime(150),
                    filter( s => !s ),
                    take(1)
                  ).subscribe( () => {
                    restore();
                    wheelListen();
                  });
                break;
              case 'blocking':
                scrollEnd$.pipe(take(1)).subscribe(restore);
                break;
              default:
                const threshold = this.viewport.wheelMode;
                let removedEvent = false;

                this.viewport.scrollFrameRate
                  .pipe(takeUntil(scrollEnd$.pipe(take(1))))
                  .subscribe(
                    {
                      next: frameRate => {
                        if (!removedEvent && frameRate < threshold) {
                          wheelUnListen();
                          removedEvent = true;
                        }
                      },
                      complete: () => {
                        const lastWheel$ = fromEvent(viewPort, 'wheel').pipe(debounceTime(50), take(1));
                        race(lastWheel$, timer(51) as any)
                          .subscribe( () => {
                            restore();
                            if (removedEvent) {
                              wheelListen();
                            }
                          });
                          // we restore back after 100 ms, for some reason, if it's immediate, we hit a cycle of wheel/scroll/no-scroll and not wheel/scroll/WAIIIIIT/no-scrol
                          // TODO: maybe we can measure time between no-scrolling and wheel to find this MS value
                          //        OR, register a temp `wheel` listener that will detect wheel end and re-register the original handler.
                      }
                    }
                  );
            }
          }
        }
        this.viewport.scrollToOffset(offset);
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };
    updateScrollPosition();
    // We don't auto enable, the virtual scroll viewport component will decide
    // wheelListen();

    this.viewport
      .scrolling
      .subscribe(isScrolling => {
        if (!isScrolling) {
          offset = this.viewport.measureScrollOffset();
        }
      });

    return { wheelListen, wheelUnListen, get listening() { return listening } };
  }

  private attachView(ds: PblDataSource<T>): void {
    if (ds) {
      this.ds = ds;
      this._renderedRanges = [ { start: 0, end: 0 }, this.cdkTable.viewChange.value, { start: 0, end: 0 } ];

      this.viewport.renderedRangeStream
        .pipe( takeUntil(this.destroyed) )
        .subscribe( range => {
          if (this.headerLength + this.footerLength === 0) { // if no row/sticky meta rows, move on...
            this._renderedRanges = [ { start: 0, end: 0 }, range, { start: 0, end: 0 } ];
            return this.cdkTable.viewChange.next(range);
          }

          /*  WHAT IS GOING ON HERE? */

          /*  Table rows are split into 3 sections: Header, Data, Footer.
              In the virtual playground only DATA rows are dynamic. Header & Footer rows are fixed.

              The `CdkTable` works the same, also have the same sections with a stream API for DATA rows only.
              `CdkTable.viewChange.next(RANGE)` will emit to the datasource which will result in a new data section from the datasource.

              `CdkTable` alone does not support virtual scrolling, to achieve it we use a virtual scroll viewport which wraps the entire `CdkTable`.
              This means that ALL sections are wrapped (hence scrolled over) but only DATA rows are moving...

              Each emission of `ListRange` in `renderedRangeStream` is based on size calculation of ALL sections (see `measureRangeSize` above)
              and we need to extract the relevant range for DATA rows only and pass it on to the grid.

              To make this work we need to extract Header/Footer rows based on the starting position of the range and handle them as well.
              Because the grid will only handle the scrolling of DATA rows we need to update HEADER/FOOTER rows to show/hide based on the range.

              Because Header/Footer rows are fixed we do this by hiding them with `display: none`, unless they are sticky / pinned.
              One exception is the main header row, which we hide virtually because we need it to render and reflect the cell size.

              We first extract the actual ranges for each section and update the `CdkTable` with the DATA row range.
              We then wait for the rows to render, which is the time for us to also "render" Header/Footer rows...
              We don't "render" them per-se, they are already rendered, we just show/hide them based on the range and state (sticky).
              This is important, hiding will cause the total height of the scroll container to shrink to the size it should be.
              We defer this operation to run AFTER the rows are rendered (not immediately) because an immediate change will trigger
              a change in the scroll container size resulting in a scroll event that will bring us back here but this time with
              a height that does not fit the range. Immediate change removes rows (Header/Footer) before the new range is applied.
              Only after the rows are rendered we can show/hide the Header/Footer rows.
          */

          // Extracting actual ranges for each section.
          this._renderedRanges = splitRange(range, this.metaRows[0], ds.length);
          const [ header, data, footer ] = this._renderedRanges;

          this.cdkTable.onRenderRows.pipe(take(1)).subscribe(() => {
            // We update the header DOM elements in reverse, skipping the last (first when reversed) DOM element.
            // The skipped element is the grid's header row that must keep track of the layout for internal size calculation (e.g. group header rows).
            // An hidden row is one that is out of range AND not sticky
            if (this.headerLength > 0) {
              const htmlRows = this.header.rows;
              const renderedRows = this.header.rendered;
              const stickyRows = this.header.sticky;
              let rowIndex = 0;
              for (const len = this.header.sticky.length - 1; rowIndex < len; rowIndex++) {
                // assign rendered state + if not rendered and not sticky, set display to "none"
                htmlRows[rowIndex].style.display = !(renderedRows[rowIndex] = rowIndex >= header.start) && !stickyRows[rowIndex]
                  ? 'none'
                  : null
                ;
              }

              // Here we update the main header row, when we need to hide it we apply a class that will hide it virtually, i.e. not showing but keeping internal layout.
              if (!(renderedRows[rowIndex] = rowIndex >= header.start) && !stickyRows[rowIndex]) {
                htmlRows[rowIndex].classList.add('pbl-ngrid-row-visually-hidden');
              } else if (this.grid.showHeader && htmlRows[rowIndex]) {
                htmlRows[rowIndex].classList.remove('pbl-ngrid-row-visually-hidden');
              }
            }

            if (this.footerLength > 0) {
              const htmlRows = this.footer.rows;
              const renderedRows = this.footer.rendered;
              const stickyRows = this.footer.sticky;
              let rowIndex = 0;
              for (const len = this.footer.sticky.length; rowIndex < len; rowIndex++) {
                // assign rendered state + if not rendered and not sticky, set display to "none"
                htmlRows[rowIndex].style.display = !(renderedRows[rowIndex] = rowIndex < footer.end) && !stickyRows[rowIndex]
                  ? 'none'
                  : null
                ;
              }
            }
          });

          this.cdkTable.viewChange.next(data);
        });

      // add meta rows to the total row count.
      this.dataStream = ds.onRenderDataChanging
        .pipe(
          takeUntil(this.destroyed),
          map( ({data}) => {
            const metaRows = this.metaRows = [ this.header.rows.length, this.footer.rows.length ];
            return new Array( data.length + metaRows[0] + metaRows[1] );
          }),
        );

      ds.onRenderedDataChanged
        .pipe(
          takeUntil(this.destroyed),
          map( () => ds.length ),
          startWith(0),
          pairwise(),
          filter( ([prev, curr]) => prev !== curr ),
        )
        .subscribe( ([prev, curr]) => {
          this.ngZone.onStable.pipe(take(1)).subscribe( () => this.viewport.onSourceLengthChange(prev, curr) );
        });

      this.viewport.attach(this as any);
    }
  }

  private detachView(): void {
    this.ds = undefined;
    this.viewport.detach();
  }
}
