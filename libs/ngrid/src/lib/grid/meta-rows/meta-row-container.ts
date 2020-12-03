import { Subject } from 'rxjs';
import { Component, Input, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { unrx } from '../utils';
import { PblNgridMetaRowService } from './meta-row.service';

@Component({
  selector: 'div[pbl-ngrid-fixed-meta-row-container]',
  template: `<div class="pbl-cdk-table" [style.width.px]="_width"></div><div class="pbl-cdk-table" [style.width.px]="_width$ | async"></div>`,
  host: { // tslint:disable-line:no-host-metadata-property
    style: 'flex: 0 0 auto; overflow: hidden;',
    '[style.width.px]': '_innerWidth',
  },
})
export class PblNgridMetaRowContainerComponent implements OnChanges, OnDestroy {

  @Input('pbl-ngrid-fixed-meta-row-container') type: 'header' | 'footer';

  /**
   * The inner width of the grid, the viewport width of a row.
   * The width of the grid minus scroll bar.
   */
  _innerWidth: number;
  _minWidth: number;
  _width: number;
  readonly _width$ = new Subject<number>();

  private _totalColumnWidth = 0;
  private element: HTMLElement;
  private _hzScrollDir: -1 | 1 = 1;

  constructor(public readonly metaRows: PblNgridMetaRowService, elRef: ElementRef<HTMLElement>) {
    this.element = elRef.nativeElement;

    metaRows.sync.pipe(unrx(this)).subscribe( () => this.syncRowDefinitions() );

    this.metaRows.extApi.events
      .pipe(unrx(this))
      .subscribe( event => {
        if (event.kind === 'onResizeRow') {
          this.updateWidths();
        }
      });

    this.metaRows.extApi.grid.columnApi.totalColumnWidthChange
      .pipe(unrx(this))
      .subscribe( width => {
        this._totalColumnWidth = width;
        this.updateWidths();
      });

    this._hzScrollDir = this.metaRows.extApi.getDirection() === 'rtl' ? -1 : 1
    this.metaRows.extApi.directionChange()
      .pipe(unrx(this))
      .subscribe( dir => this._hzScrollDir = dir === 'rtl' ? -1 : 1 );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('type' in changes) {
      const scrollContainerElement = this.element;
      scrollContainerElement.scrollLeft = this.metaRows.extApi.grid.viewport.measureScrollOffset('start') * this._hzScrollDir;

      if (changes.type.isFirstChange) {
        this.metaRows.hzScroll
          .pipe(unrx(this))
          .subscribe( offset => scrollContainerElement.scrollLeft = offset * this._hzScrollDir);

        this.metaRows.extApi.cdkTable.onRenderRows
          .pipe(unrx(this))
          .subscribe( () => { this.updateWidths() });
      }
    }
  }

  ngOnDestroy(): void {
    this._width$.complete();
    unrx.kill(this);
  }

  private updateWidths(): void {
    this._innerWidth = this.metaRows.extApi.grid.viewport.innerWidth;
    this._minWidth = this.metaRows.extApi.cdkTable.minWidth;
    this._width = Math.max(this._innerWidth, this._minWidth);
    this._width$.next(Math.max(this._innerWidth, this._totalColumnWidth))
  }

  private syncRowDefinitions(): void {
    const isHeader = this.type === 'header';
    const section = isHeader ? this.metaRows.header : this.metaRows.footer;

    const widthContainer = this.element.firstElementChild;
    const container = widthContainer.nextElementSibling;

    if (isHeader) {
      widthContainer.appendChild(this.metaRows.gridWidthRow.el);
    }

    for (const def of section.fixed) {
      container.appendChild(def.el);
    }
  }
}
