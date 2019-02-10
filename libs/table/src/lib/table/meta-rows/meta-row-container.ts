import { Component, Input, ElementRef } from '@angular/core';

import { UnRx } from '@pebula/utils';

import { PblMetaRowDefinitions } from '../columns/types';
import { PblTableMetaRowService } from './meta-row.service';

@Component({
  selector: 'div[pbl-ngrid-fixed-meta-row-container]',
  template: `<div class="pbl-cdk-table" [style.min-width]="_minWidth"></div>`,
  host: { // tslint:disable-line:use-host-property-decorator
    style: 'flex: 0 0 auto; overflow: hidden;',
    '[style.width]': '_innerWidth'
  }
})
@UnRx()
export class PblTableMetaRowContainerComponent {

  @Input('pbl-ngrid-fixed-meta-row-container') set type(value: 'header' | 'footer') {
    if (this._type !== value) {
      this.init(value);
    }
  };

  /**
   * The inner width of the table, the viewport width of a row.
   * The width of the table minus scroll bar.
   */
  _innerWidth: string;
  _minWidth: string;

  private _type: 'header' | 'footer';
  private defs: Array<{ index: number; rowDef: PblMetaRowDefinitions }>;
  private element: HTMLElement;

  constructor(public readonly metaRows: PblTableMetaRowService, elRef: ElementRef<HTMLElement>) {
    this.element = elRef.nativeElement;
    metaRows.sync.pipe(UnRx(this)).subscribe( () => this.syncRowDefinitions() );
    this.metaRows.extApi.events
      .pipe(UnRx(this))
      .subscribe( event => {
        if (event.kind === 'onResizeRow') {
          this._innerWidth = `${this.metaRows.extApi.table.viewport.innerWidth}px`;
          this._minWidth = this.metaRows.extApi.cdkTable.minWidth;
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
        this._innerWidth = `${this.metaRows.extApi.table.viewport.innerWidth}px`;
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
