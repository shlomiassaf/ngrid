import { Component, EmbeddedViewRef, Input, ElementRef } from '@angular/core';
import { HeaderRowOutlet, FooterRowOutlet } from '@angular/cdk/table';

import { NegMetaRowDefinitions } from '../columns/types';
import { KillOnDestroy } from '../utils';
import { NegTableMetaRowService } from './meta-row.service';

@Component({
  selector: 'div[neg-table-fixed-meta-row-container]',
  template: `<div class="neg-cdk-table" [style.min-width]="_minWidth"></div>`,
  host: { // tslint:disable-line:use-host-property-decorator
    style: 'flex: 0 0 auto; overflow: hidden;',
    '[style.width]': '_innerWidth'
  }
})
@KillOnDestroy()
export class NegTableMetaRowContainerComponent {

  @Input('neg-table-fixed-meta-row-container') set type(value: 'header' | 'footer') {
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
  private defs: Array<{ index: number; rowDef: NegMetaRowDefinitions }>;
  private element: HTMLElement;

  constructor(public readonly metaRows: NegTableMetaRowService, elRef: ElementRef<HTMLElement>) {
    this.element = elRef.nativeElement;
    metaRows.sync.pipe(KillOnDestroy(this)).subscribe( () => this.syncRowDefinitions() );
    this.metaRows.extApi.events
      .pipe(KillOnDestroy(this))
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
      .pipe(KillOnDestroy(this))
      .subscribe( offset => scrollContainerElement.scrollLeft = offset );

    this.metaRows.extApi.cdkTable.onRenderRows
      .pipe(KillOnDestroy(this))
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
