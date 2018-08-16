import ResizeObserver from 'resize-observer-polyfill';

import {
  Directive,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';

import { SgTableComponent } from '../../table.component';
import { SgColumn } from '../../columns';

const SG_TABLE_MAP = new Map<SgTableComponent<any>, SgTableGroupHeaderSizeController>();

class SgTableGroupHeaderSizeController {
  private entries: WeakMap<any, SgColumnSizeObserver>;
  private ro: ResizeObserver;
  private columns: SgColumnSizeObserver[] = [];

  constructor(private table: SgTableComponent<any>) {
    this.entries = new WeakMap<any, SgColumnSizeObserver>();
    this.ro = new ResizeObserver( entries => this.onResize(entries) );
  }

  add(col: SgColumnSizeObserver): void {
    this.entries.set(col.target, col);
    this.ro.observe(col.target);
    this.columns.push(col);
  }

  remove(col: SgColumnSizeObserver): void {
    this.ro.unobserve(col.target);
    this.entries.delete(col.target);
    const idx = this.columns.indexOf(col);
    if (idx > -1) {
      this.columns.splice(idx, 1);
    }
    if (this.columns.length === 0) {
      this.ro.disconnect();
      SG_TABLE_MAP.delete(this.table);
    }
  }

  private onResize(entries: ResizeObserverEntry[]): void {
    const hasMatch = entries.some( entry => this.entries.has(entry.target) );
    if (hasMatch) {
      this.table.resizeRows(this.columns);
    }
  }

  static get(table: SgTableComponent<any>): SgTableGroupHeaderSizeController {
    let controller = SG_TABLE_MAP.get(table);
    if (!controller) {
      controller = new SgTableGroupHeaderSizeController(table);
      SG_TABLE_MAP.set(table, controller);
    }
    return controller;
  }
}

/**
 * A directive that listen to size changes from the element of a cell, using ResizeObserver.
 * When a change occures it will emit it to the SgTable host of this directive, along with all other observed columns for the table.
 *
 * In other words, all columns of a table, marked with `SgColumnSizeObserver`, will be sent.
 *
 * Because most of the size changes concern all columns of a row and because ResizeObserver will emit them all in the same event
 * an entire row should emit once, with all columns.
 */
@Directive({ selector: 'sg-table-cell[observeSize], sg-table-header-cell[observeSize]' })
export class SgColumnSizeObserver implements OnDestroy {
  @Input('observeSize') get column(): SgColumn { return this._column; };
  set column(value: SgColumn) {
    if (this._column) {
      this._column.sizeInfo = undefined;
    }
    this._column = value;
    if (value) {
      value.sizeInfo = this;
    }
  };
  target: HTMLElement;

  get width(): number { return this.target.offsetWidth; }
  get height(): number { return this.target.offsetHeight; }
  /**
   * The computed style for this cell.
   * Note that this is a getter that call `getComputedStyle`, store before use.
   */
  get style(): CSSStyleDeclaration { return getComputedStyle(this.target); }

  private _column: SgColumn;
  private controller: SgTableGroupHeaderSizeController;

  constructor(el: ElementRef, table: SgTableComponent<any>) {
    this.controller = SgTableGroupHeaderSizeController.get(table);
    this.target = el.nativeElement;
    this.controller.add(this);
  }

  ngOnDestroy() {
    this.controller.remove(this);
    if (this._column) {
      this._column.sizeInfo = undefined;
    }
  }
}
