import ResizeObserver from 'resize-observer-polyfill';

import {
  Directive,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';

import { PblTableComponent } from '../../table.component';
import { PblColumn, ColumnSizeInfo } from '../../columns/index';

const NEG_TABLE_MAP = new Map<PblTableComponent<any>, PblTableGroupHeaderSizeController>();

class PblTableGroupHeaderSizeController {
  private entries: WeakMap<any, PblColumnSizeObserver>;
  private ro: ResizeObserver;
  private columns: PblColumnSizeObserver[] = [];

  constructor(private table: PblTableComponent<any>) {
    this.entries = new WeakMap<any, PblColumnSizeObserver>();
    this.ro = new ResizeObserver( entries => this.onResize(entries) );
  }

  static get(table: PblTableComponent<any>): PblTableGroupHeaderSizeController {
    let controller = NEG_TABLE_MAP.get(table);
    if (!controller) {
      controller = new PblTableGroupHeaderSizeController(table);
      NEG_TABLE_MAP.set(table, controller);
    }
    return controller;
  }

  add(col: PblColumnSizeObserver): void {
    this.entries.set(col.target, col);
    this.ro.observe(col.target);
    this.columns.push(col);
  }

  remove(col: PblColumnSizeObserver): void {
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
    const resized: PblColumnSizeObserver[] = [];
    for (const entry of entries) {
      const o = this.entries.get(entry.target);
      if (o) {
        resized.push(o);
      }
    }
    if (resized.length > 0) {
      let isDragging = false;
      for (const c of resized) {
        isDragging = isDragging || c.column.columnDef.isDragging;
        c.updateSize();
      }
      if (!isDragging) {
        this.table.resizeColumns(this.columns.map( c => c.column ));
      }
    }
  }
}

/**
 * A directive that listen to size changes from the element of a cell, using ResizeObserver.
 * When a change occurs it will emit it to the PblTable host of this directive, along with all other observed columns for the table.
 *
 * In other words, all columns of a table, marked with `PblColumnSizeObserver`, will be sent.
 *
 * Because most of the size changes concern all columns of a row and because ResizeObserver will emit them all in the same event
 * an entire row should emit once, with all columns.
 */
@Directive({ selector: 'pbl-table-cell[observeSize], pbl-table-header-cell[observeSize]' })
export class PblColumnSizeObserver extends ColumnSizeInfo implements OnDestroy {
  @Input('observeSize') get column(): PblColumn { return this._column; }
  set column(value: PblColumn) { this.attachColumn(value); }

  private controller: PblTableGroupHeaderSizeController;

  constructor(el: ElementRef, table: PblTableComponent<any>) {
    super(el.nativeElement);
    this.controller = PblTableGroupHeaderSizeController.get(table);
    this.controller.add(this);
  }

  ngOnDestroy() {
    this.controller.remove(this);
    this.detachColumn();
  }
}
