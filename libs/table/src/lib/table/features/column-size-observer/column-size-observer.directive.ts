import ResizeObserver from 'resize-observer-polyfill';

import {
  Directive,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';

import { NegTableComponent } from '../../table.component';
import { NegColumnSizeInfo } from '../../types';
import { NegColumn } from '../../columns';

const NEG_TABLE_MAP = new Map<NegTableComponent<any>, NegTableGroupHeaderSizeController>();

class NegTableGroupHeaderSizeController {
  private entries: WeakMap<any, NegColumnSizeObserver>;
  private ro: ResizeObserver;
  private columns: NegColumnSizeObserver[] = [];

  constructor(private table: NegTableComponent<any>) {
    this.entries = new WeakMap<any, NegColumnSizeObserver>();
    this.ro = new ResizeObserver( entries => this.onResize(entries) );
  }

  static get(table: NegTableComponent<any>): NegTableGroupHeaderSizeController {
    let controller = NEG_TABLE_MAP.get(table);
    if (!controller) {
      controller = new NegTableGroupHeaderSizeController(table);
      NEG_TABLE_MAP.set(table, controller);
    }
    return controller;
  }

  add(col: NegColumnSizeObserver): void {
    this.entries.set(col.target, col);
    this.ro.observe(col.target);
    this.columns.push(col);
  }

  remove(col: NegColumnSizeObserver): void {
    this.ro.unobserve(col.target);
    this.entries.delete(col.target);
    const idx = this.columns.indexOf(col);
    if (idx > -1) {
      this.columns.splice(idx, 1);
    }
    if (this.columns.length === 0) {
      this.ro.disconnect();
      NEG_TABLE_MAP.delete(this.table);
    }
  }

  private onResize(entries: ResizeObserverEntry[]): void {
    const resized: NegColumnSizeObserver[] = [];
    for (const entry of entries) {
      const o = this.entries.get(entry.target);
      if (o) {
        resized.push(o);
      }
    }
    if (resized.length > 0) {
      for (const c of resized) {
        c.resized();
      }
      this.table.resizeRows(this.columns);
    }
  }
}

/**
 * A directive that listen to size changes from the element of a cell, using ResizeObserver.
 * When a change occures it will emit it to the NegTable host of this directive, along with all other observed columns for the table.
 *
 * In other words, all columns of a table, marked with `NegColumnSizeObserver`, will be sent.
 *
 * Because most of the size changes concern all columns of a row and because ResizeObserver will emit them all in the same event
 * an entire row should emit once, with all columns.
 */
@Directive({ selector: 'neg-table-cell[observeSize], neg-table-header-cell[observeSize]' })
export class NegColumnSizeObserver implements NegColumnSizeInfo, OnDestroy {
  @Input('observeSize') get column(): NegColumn { return this._column; };
  set column(value: NegColumn) {
    if (this._column) {
      this._column.sizeInfo = undefined;
    }
    this._column = value;
    if (value) {
      value.sizeInfo = this;
    }
  };
  target: HTMLElement;

  width: number;
  height: number;

  /**
   * The computed style for this cell.
   * Note that this is a getter that call `getComputedStyle`, store before use.
   */
  style: CSSStyleDeclaration;

  private _column: NegColumn;
  private controller: NegTableGroupHeaderSizeController;

  constructor(el: ElementRef, table: NegTableComponent<any>) {
    this.controller = NegTableGroupHeaderSizeController.get(table);
    this.target = el.nativeElement;
    this.controller.add(this);
  }

  resized(): void {
    const el = this.target;
    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
    this.style = getComputedStyle(el);
    if ( this._column) {
      this._column.columnDef.onResize();
    }
  }

  ngOnDestroy() {
    this.controller.remove(this);
    if (this._column) {
      this._column.sizeInfo = undefined;
    }
  }
}
