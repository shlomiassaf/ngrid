import ResizeObserver from 'resize-observer-polyfill';

import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { PblNgridComponent } from '../../ngrid.component';
import { PblColumn, ColumnSizeInfo } from '../../column/model';

const PBL_NGRID_MAP = new Map<PblNgridComponent<any>, PblNgridGroupHeaderSizeController>();

class PblNgridGroupHeaderSizeController {
  private entries: WeakMap<any, PblColumnSizeObserver>;
  private ro: ResizeObserver;
  private columns: PblColumnSizeObserver[] = [];

  constructor(private grid: PblNgridComponent<any>) {
    this.entries = new WeakMap<any, PblColumnSizeObserver>();
    this.ro = new ResizeObserver( entries => {
      requestAnimationFrame(() => this.onResize(entries) );
    });
  }

  static get(table: PblNgridComponent<any>): PblNgridGroupHeaderSizeController {
    let controller = PBL_NGRID_MAP.get(table);
    if (!controller) {
      controller = new PblNgridGroupHeaderSizeController(table);
      PBL_NGRID_MAP.set(table, controller);
    }
    return controller;
  }

  has(col: PblColumnSizeObserver): boolean {
    return this.columns.indexOf(col) !== -1;
  }

  hasColumn(column: PblColumn): boolean {
    return this.columns.some( c => c.column === column );
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
      PBL_NGRID_MAP.delete(this.grid);
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
        this.grid.resizeColumns(this.columns.map( c => c.column ));
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
@Directive({ selector: 'pbl-ngrid-cell[observeSize], pbl-ngrid-header-cell[observeSize]' })
export class PblColumnSizeObserver extends ColumnSizeInfo implements AfterViewInit, OnDestroy {
  @Input('observeSize') get column(): PblColumn { return this._column; }
  set column(value: PblColumn) { this.attachColumn(value); }

  private controller: PblNgridGroupHeaderSizeController;

  constructor(el: ElementRef, table: PblNgridComponent<any>) {
    super(el.nativeElement);
    this.controller = PblNgridGroupHeaderSizeController.get(table);
  }

  attachColumn(column: PblColumn): void {
    if (!this.controller.hasColumn(column)) {
      super.attachColumn(column);
      this.updateSize();
    } else {
      this._column = column;
    }
  }

  ngAfterViewInit(): void {
    if (!this.column || !this.controller.hasColumn(this.column)) {
      this.controller.add(this);
    }
  }

  ngOnDestroy() {
    this.controller.remove(this);
    this.detachColumn();
  }
}
