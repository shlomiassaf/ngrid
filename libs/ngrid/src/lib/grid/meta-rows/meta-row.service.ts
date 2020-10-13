import { animationFrameScheduler, Observable, Subject, asapScheduler } from 'rxjs';
import { auditTime, filter, take, debounceTime } from 'rxjs/operators';

import { Injectable, Inject } from '@angular/core';

import { PblNgridExtensionApi, EXT_API_TOKEN } from '../../ext/grid-ext-api';
import { PblMetaRowDefinitions } from '../columns/types';
import { PblMetaRowDirective } from './meta-row.directive';

function metaRowSectionFactory(): MetaRowSection {
  return { fixed: [], row: [], sticky: [], all: [] };
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

  addMetaRow(metaRow: PblMetaRowDirective): void {
    const { columnStore } = this.extApi;
    const { header, footer } = columnStore.metaColumnIds;

    const rowDef = metaRow.meta;
    if (rowDef === columnStore.headerColumnDef) {
      if (metaRow.gridWidthRow === true) {
        this.gridWidthRow = { rowDef, el: metaRow.elRef.nativeElement };
        this.header.all.push(rowDef);
      } else {
        this.addToSection(this.header, metaRow, columnStore.metaColumnIds.header.length);
      }
    } else if (rowDef === columnStore.footerColumnDef) {
      this.addToSection(this.footer, metaRow, 0);
    } else {
      let index = header.findIndex( h => h.rowDef === rowDef );
      if (index > -1) {
        this.addToSection(this.header, metaRow, index);
      } else {
        index = footer.findIndex( h => h.rowDef === rowDef );
        if (index > -1) {
          this.addToSection(this.footer, metaRow, index);
        } else {
          throw new Error('Invalid operation');
        }
      }
    }
    this.sync$.next();
  }

  removeMetaRow(metaRow: PblMetaRowDirective): void {
    const rowDef = metaRow.meta;
    let index = this.header.all.indexOf(metaRow.meta);
    if (index > -1) {
      this.header.all.splice(index, 1);
      index = this.header[rowDef.type].findIndex( h => h.rowDef === rowDef );
      this.header[rowDef.type].splice(index, 1);
    } else if ( (index = this.footer.all.indexOf(metaRow.meta)) > -1) {
      this.footer.all.splice(index, 1);
      index = this.footer[rowDef.type].findIndex( h => h.rowDef === rowDef );
      this.footer[rowDef.type].splice(index, 1);
    }
  }

  private addToSection(section: MetaRowSection, metaRow: PblMetaRowDirective, index: number): void {
    const rowDef = metaRow.meta;
    section[rowDef.type].push( { index, rowDef, el: metaRow.elRef.nativeElement } );
    section.all.push(rowDef);
  }
}
