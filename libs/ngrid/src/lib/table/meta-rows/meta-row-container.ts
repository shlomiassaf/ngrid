import { Component, Input, ElementRef } from '@angular/core';

import { UnRx } from '@pebula/utils';

import { PblMetaRowDefinitions } from '../columns/types';
import { PblNgridMetaRowService } from './meta-row.service';

@Component({
  selector: 'div[pbl-ngrid-fixed-meta-row-container]',
  template: `<div class="pbl-cdk-table" [style.width.px]="_width"></div>`,
  host: { // tslint:disable-line:use-host-property-decorator
    style: 'flex: 0 0 auto; overflow: hidden;',
    '[style.width.px]': '_innerWidth',
  },
})
@UnRx()
export class PblNgridMetaRowContainerComponent {

  @Input('pbl-ngrid-fixed-meta-row-container') set type(value: 'header' | 'footer') {
    if (this._type !== value) {
      this.init(value);
    }
  };

  /**
   * The inner width of the table, the viewport width of a row.
   * The width of the table minus scroll bar.
   */
  _innerWidth: number;
  _minWidth: number;
  _width: number;

  private _type: 'header' | 'footer';
  private defs: Array<{ index: number; rowDef: PblMetaRowDefinitions }>;
  private element: HTMLElement;

  constructor(public readonly metaRows: PblNgridMetaRowService, elRef: ElementRef<HTMLElement>) {
    this.element = elRef.nativeElement;
    metaRows.sync.pipe(UnRx(this)).subscribe( () => this.syncRowDefinitions() );
    this.metaRows.extApi.events
      .pipe(UnRx(this))
      .subscribe( event => {
        if (event.kind === 'onResizeRow') {
          this._innerWidth = this.metaRows.extApi.table.viewport.innerWidth;
          this._minWidth = this.metaRows.extApi.cdkTable.minWidth;
          this._width = Math.max(this._innerWidth, this._minWidth);
        }
      });
  }

  private init(type: 'header' | 'footer'): void {

    if (type === 'header') {
      this._type = type;
    } else {
      this._type = 'footer';
    }

    const scrollContainerElement = this.element;
    scrollContainerElement.scrollLeft = this.metaRows.extApi.table.viewport.measureScrollOffset('start');

    this.metaRows.hzScroll
      .pipe(UnRx(this))
      .subscribe( offset => scrollContainerElement.scrollLeft = offset );

    this.metaRows.extApi.cdkTable.onRenderRows
      .pipe(UnRx(this))
      .subscribe( () => {
        this._innerWidth = this.metaRows.extApi.table.viewport.innerWidth;
        this._width = Math.max(this._innerWidth, this._minWidth);
      });
  }

  private syncRowDefinitions(): void {
    this.defs = [];
    const isHeader = this._type === 'header';
    const section = isHeader ? this.metaRows.header : this.metaRows.footer;

    const container = this.element.firstElementChild;
    for (const def of section.fixed) {
      this.defs.push(def);
      container.appendChild(def.el);
    }
  }
}
