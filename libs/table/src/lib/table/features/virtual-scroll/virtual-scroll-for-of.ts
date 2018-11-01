import { Observable, Subject } from 'rxjs';
import { filter, first, startWith, pairwise, takeUntil, map } from 'rxjs/operators';

import { NgZone, ViewContainerRef } from '@angular/core';
import { CollectionViewer, ListRange } from '@angular/cdk/collections';

import { NegTableComponent } from '../../table.component';
import { NegTablePluginController } from '../../../ext/plugin-control';
import { NegDataSource } from '../../../data-source/data-source';
import { NegCdkTableComponent } from '../../neg-cdk-table/neg-cdk-table.component';
import { NegCdkVirtualScrollViewportComponent } from './virtual-scroll-viewport.component';
import { splitRange, updateStickyRows, measureRangeSize, StickyDirectionVt } from './utils';

export interface NgeVirtualTableRowInfo {
  readonly headerLength: number;
  readonly rowLength: number;
  readonly footerLength: number;
}

export class NegVirtualScrollForOf<T> implements CollectionViewer, NgeVirtualTableRowInfo {
  viewChange: Observable<ListRange>;

  dataStream: Observable<T[] | ReadonlyArray<T>>;

  get headerLength(): number { return this.vcRefs.header.length  }
  get rowLength(): number { return this.vcRefs.data.length  }
  get footerLength(): number { return this.vcRefs.footer.length  }

  private destroyed = new Subject<void>();
  private ds: NegDataSource<T>;

  private get vcRefs(): { header: ViewContainerRef; data: ViewContainerRef; footer: ViewContainerRef; } {
    const value = {
      header: this.cdkTable._headerRowOutlet.viewContainer,
      data: this.cdkTable._rowOutlet.viewContainer,
      footer: this.cdkTable._footerRowOutlet.viewContainer,
    };
    Object.defineProperty(this, 'vcRefs', { value });
    return value;
  }

  private renderedContentOffset = 0;
  /** A tuple containing the last known ranges [header, data, footer] */
  private _renderedRanges: [ListRange, ListRange, ListRange];
  /** The length of meta rows [0] = header [1] = footer */
  private metaRows: [number, number] = [0, 0];

  private header = { rows: [] as HTMLElement[], sticky: [] as boolean[] };
  private footer = { rows: [] as HTMLElement[], sticky: [] as boolean[] };

  constructor(table: NegTableComponent<T>,
              private cdkTable: NegCdkTableComponent<T>,
              private viewport: NegCdkVirtualScrollViewportComponent,
              private ngZone: NgZone) {
    this.viewChange = this.cdkTable.viewChange;

    NegTablePluginController.find(table).events
      .pipe( takeUntil(this.destroyed) )
      .subscribe( event => {
        if (event.kind === 'onDataSource') {
          this.detachView();
          this.attachView(event.curr);
        }
      });
    this.attachView(table.dataSource);

    this.viewport.offsetChange
      .pipe( takeUntil(this.destroyed) )
      .subscribe( offset => {
        if (this.renderedContentOffset !== offset) {
          this.renderedContentOffset = offset;
          updateStickyRows(offset, this.header.rows, this.header.sticky, 'top');
          updateStickyRows(offset, this.footer.rows, this.footer.sticky, 'bottom');
        }
      });
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
    const vcRefs = [this.vcRefs.header, this.vcRefs.data, this.vcRefs.footer];

    const vcRefSizeReducer = (total: number, vcRef: ViewContainerRef, index: number): number => {
      return total + measureRangeSize(vcRef, ranges[index], renderedRanges[index], orientation);
    };

    return vcRefs.reduce(vcRefSizeReducer, 0);
  }

  setMetaRows(rows: HTMLElement[], stickyStates: boolean[], type: StickyDirectionVt): void {
    const store = type === 'top' ? this.header : this.footer;
    store.rows = rows;
    store.sticky = stickyStates;
    updateStickyRows(this.renderedContentOffset, store.rows, store.sticky, type);
  }

  destroy(): void {
    this.detachView();
    this.destroyed.next();
    this.destroyed.complete();
  }

  private attachView(ds: NegDataSource<T>): void {
    if (ds) {
      this.ds = ds;
      this._renderedRanges = [ { start: 0, end: 0 }, this.cdkTable.viewChange.value, { start: 0, end: 0 } ];

      this.viewport.renderedRangeStream
        .pipe( takeUntil(this.destroyed) )
        .subscribe( range => {
          this._renderedRanges = splitRange(range, this.metaRows[0], ds.length);
          const [ header, data, footer ] = this._renderedRanges;

          // Go over header/footer DOM elements and toggle their display property based on the position
          // We hide all rows that are not rendered (i.e. in view or buffered for view). We do this
          // to allow proper content measurement by the virtual scroll viewport.

          // We update the header DOM elements in reverse, skipping the last (first when reversed) DOM element.
          // The skipped element is the table's header row that must remain active for internal size calculation (e.g. group header rows).
          const headerStickyState = this.header.sticky.map( (s, i) =>  i < header.start && !s);
          for (let rowIndex = headerStickyState.length - 2; rowIndex > -1; rowIndex--) {
            this.header.rows[rowIndex].style.display = headerStickyState[rowIndex] ? 'none' : null;
          }

          const footerStickyState = this.footer.sticky.map( (s, i) => i >= footer.end && !s);
          for (const rowIndex in footerStickyState) { //tslint:disable-line:forin
            this.footer.rows[rowIndex].style.display = footerStickyState[rowIndex] ? 'none' : null;
          }

          // Because removed any layout effect of header/footer rows we can use the
          // range of the data rows only
          this.cdkTable.viewChange.next(data);
          // this.ngZone.run(() => this.cdkTable.viewChange.next(data) );
        });

      // add meta rows to the total row count.
      this.dataStream = ds.onViewDataChanging
      .pipe(
        takeUntil(this.destroyed),
        map( collection => {
          const metaRows = this.metaRows = [ this.vcRefs.header.length, this.vcRefs.footer.length ];
          return new Array( collection.length + metaRows[0] + metaRows[1] );
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
          this.ngZone.onStable.pipe(first()).subscribe( () => this.viewport.onSourceLengthChange(prev, curr) );
        });

      this.viewport.attach(this as any);
    }
  }

  private detachView(): void {
    this.ds = undefined;
    this.viewport.detach();
  }
}
