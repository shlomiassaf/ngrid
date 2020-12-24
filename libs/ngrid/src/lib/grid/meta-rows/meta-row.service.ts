import { animationFrameScheduler, Observable, Subject, asapScheduler } from 'rxjs';
import { auditTime, filter, take, debounceTime } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { PblMetaRowDefinitions } from '@pebula/ngrid/core';

import { PblNgridExtensionApi, EXT_API_TOKEN } from '../../ext/grid-ext-api';

function metaRowSectionFactory(): MetaRowSection {
  return { fixed: [], row: [], sticky: [], all: [] };
}

export interface PblMetaRow {
  element: HTMLElement;
  meta: PblMetaRowDefinitions;
  gridWidthRow: any;
}

export interface MetaRowSection {
  fixed: Array<{ index: number, rowDef: PblMetaRowDefinitions; el?: HTMLElement; }>;
  row: Array<{ index: number, rowDef: PblMetaRowDefinitions; el?: HTMLElement; }>;
  sticky: Array<{ index: number, rowDef: PblMetaRowDefinitions; el?: HTMLElement; }>;
  all: PblMetaRowDefinitions[];
}

@Injectable()
export class PblNgridMetaRowService<T = any> {
  gridWidthRow: { rowDef: PblMetaRowDefinitions; el: HTMLElement; };
  header: MetaRowSection = metaRowSectionFactory();
  footer: MetaRowSection = metaRowSectionFactory();

  /**
   * Notifies that changes occured in one or more meta rows (added/removed)
   * Multiple changes are aggregated (using asapScheduler)
   */
  readonly sync: Observable<void>;
  readonly hzScroll: Observable<number>;
  private sync$ = new Subject<void>();
  private hzScroll$ = new Subject<number>();

  constructor(@Inject(EXT_API_TOKEN) public readonly extApi: PblNgridExtensionApi<T>) {
    this.sync = this.sync$ // TODO: complete
      .pipe(debounceTime(0, asapScheduler));

    this.hzScroll = this.hzScroll$.asObservable();

    extApi.onInit(() => {
      const { grid } = extApi;
      let hzOffset = grid.viewport.measureScrollOffset('start');
      let trackScroll = true;
      grid.viewport.elementScrolled()
        .pipe(
          filter( () => trackScroll ),
          auditTime(0, animationFrameScheduler),
        )
        .subscribe({
          next: () => {
            const newOffset = grid.viewport.measureScrollOffset('start');
            if (hzOffset !== newOffset) {
              this.hzScroll$.next(hzOffset = newOffset);
            } else if (grid.viewport.isScrolling) {
              trackScroll = false;
              grid.viewport.scrolling
                .pipe(take(1))
                .subscribe( () => trackScroll = true );
            }
          },
          complete: () => this.hzScroll$.complete(),
        });
    });
  }

  addMetaRow(metaRow: PblMetaRow): void {
    const { columnStore } = this.extApi;
    const header = columnStore.metaHeaderRows;
    const footer = columnStore.metaFooterRows;

    const rowDef = metaRow.meta;
    if (rowDef === columnStore.headerColumnDef) {
      if (metaRow.gridWidthRow === true) {
        // This is a dummy row used to measure width and get width resize notifications
        this.gridWidthRow = { rowDef, el: metaRow.element };
      } else {
        // This is the main header column row, it doesn't have an index but we will assign as if it's the last
        // so other features will be able to sort by physical location
        this.addToSection(this.header, metaRow, columnStore.metaHeaderRows.length);
      }
    } else if (rowDef === columnStore.footerColumnDef) {
      // This is the main footer column row
      this.addToSection(this.footer, metaRow, 0);
    } else {
      // All meta rows
      let index = header.findIndex( h => h.rowDef === rowDef );
      if (index > -1) {
        this.addToSection(this.header, metaRow, index);
      } else {
        index = footer.findIndex( h => h.rowDef === rowDef );
        if (index > -1) {
          this.addToSection(this.footer, metaRow, index);
        } else {
          if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw new Error('Invalid operation');
          }
        }
      }
    }
    this.sync$.next();
  }

  removeMetaRow(metaRow: PblMetaRow): void {
    const rowDef = metaRow.meta;
    let index = this.header.all.indexOf(metaRow.meta);
    if (index > -1) {
      this.header.all.splice(index, 1);
      index = this.header[rowDef.type].findIndex( h => h.rowDef === rowDef );
      this.header[rowDef.type].splice(index, 1);
      this.sync$.next();
    } else if ( (index = this.footer.all.indexOf(metaRow.meta)) > -1) {
      this.footer.all.splice(index, 1);
      index = this.footer[rowDef.type].findIndex( h => h.rowDef === rowDef );
      this.footer[rowDef.type].splice(index, 1);
      this.sync$.next();
    }
  }

  private addToSection(section: MetaRowSection, metaRow: PblMetaRow, index: number): void {
    const rowDef = metaRow.meta;
    section[rowDef.type].push( { index, rowDef, el: metaRow.element } );
    section.all.push(rowDef);
  }
}
