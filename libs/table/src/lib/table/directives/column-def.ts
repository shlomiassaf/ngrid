// tslint:disable:use-host-property-decorator
// tslint:disable:directive-class-suffix

import {
  Directive,
  Input,
  Inject,
  KeyValueDiffers, KeyValueDiffer,
  OnDestroy,
  DoCheck,
} from '@angular/core';
import { CdkColumnDef } from '@angular/cdk/table';

import { COLUMN } from '../columns';
import { isNegColumn } from '../columns/column';
import { CellContext } from '../context';
import { NegTableComponent } from '../table.component';
import { EXT_API_TOKEN, NegTableExtensionApi } from '../../ext/table-ext-api';
import { parseStyleWidth } from '../columns/utils';
import { uniqueColumnCss } from '../circular-dep-bridge';

/* TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

  NegTableColumnDef use's the default object KeyValueDiffer provides with angular.
  This differ will perform the diff on the entire object which IS NOT REQUIRED!
  We need to create a custom differ that does the diff on selected properties only.
*/

/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[negTableColumnDef]',
  providers: [
    { provide: CdkColumnDef, useExisting: NegTableColumnDef },
    { provide: 'MAT_SORT_HEADER_COLUMN_DEF', useExisting: NegTableColumnDef }
  ],
})
export class NegTableColumnDef<T extends COLUMN = COLUMN> extends CdkColumnDef implements DoCheck, OnDestroy {
  @Input('negTableColumnDef') get column(): T { return this._column; };
  set column(value: T) { this.attach(value); }

  get isDirty(): boolean {
    if (this._markedForCheck && !this._isDirty) {
      this._markedForCheck = false;
      this._isDirty = !!this._colDiffer.diff(this._column);
    }
    return this._isDirty;
  }

  /**
   * The complete width definition for the column.
   * There are 3 width definitions: MIN-WIDTH, WIDTH and MAX-WIDTH.
   *
   * The tuple represents them in that order, i.e: [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
   */
  get widths(): [string, string, string] { return this._widths; }

  /**
   * The last net width of the column.
   * The net width is the absolute width of the column, without padding, border etc...
   */
  get netWidth(): number { return this._netWidth; }

  isDragging = false;

  protected _colDiffer: KeyValueDiffer<any, any>;
  protected table: NegTableComponent<any>;

  private _column: T;
  private _isDirty = false;
  private _markedForCheck = false;

  /**
   * The complete width definition for the column.
   * There are 3 width definitions: MIN-WIDTH, WIDTH and MAX-WIDTH.
   *
   * The tuple represents them in that order, i.e: [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
   */
  private _widths: [string, string, string];

  /**
   * The complete width definition for the column.
   * There are 3 width definitions: MIN-WIDTH, WIDTH and MAX-WIDTH.
   *
   * The tuple represents them in that order, i.e: [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
   *
   * This property hold the initial width definitions, set by `StaticColumnWidthLogic`, which represent the user-defined values
   * as is + the relative default width for columns without a width definition.
   *
   * It is used as a cache to store the original width definition because the actual width might change based on implementation (e.e. NgColumn table cells)
   */
  private _sWidths: [string, string, string];

  /**
   * The last net width of the column.
   * The net width is the absolute width of the column, without padding, border etc...
   */
  private _netWidth: number;

  constructor(protected readonly _differs: KeyValueDiffers, @Inject(EXT_API_TOKEN) protected extApi: NegTableExtensionApi<any> ) {
    super();
    this.table = extApi.table;
  }

  /**
   * Create a cell context for the current column at the provided row index, relative to the rendered rows (not the entire datasource).
   */
  createContext<Z = any>(renderRowIndex: number): CellContext<Z> {
    if (isNegColumn(this.column)) {
      return this.extApi.contextApi.createCellContext(renderRowIndex, this.column)
    }
  }

  /**
   * Marks this column for a lazy change detection check.
   * Lazy means it will run the check only when the diff is requested (i.e. querying the `hasChanged` property).
   * This allow aggregation of changes between CD cycles, i.e. calling `markForCheck()` multiple times within the same CD cycle does not hit performance.
   *
   * Once marked for check, `negTableColumnDef` handles it's dirty (`isDirty`) state automatically, when `isDirty` is true it will remain true until the
   * CD cycle ends, i.e. until `ngDoCheck()` hits. This means that only children of `negTableColumnDef` can relay on `isDirty`, all children will run their
   * `ngDoCheck()` before `ngDoCheck()` of `negTableColumnDef`.
   *
   * This is a how we notify all cell directives about changes in a column. It is done through angular's CD logic and does not require manual
   * CD kicks and special channels between negTableColumnDef and it's children.
   */
  markForCheck(): void {
    if (!this._colDiffer) {
      this._colDiffer = this._differs.find({}).create();
      this._colDiffer.diff({});
    }
    this._markedForCheck = true;
  }

  /**
   * Update the width definitions for this column. [minWidth, width, maxWidth]
   * If an element is provided it will also apply the widths to the element.
   * @param width The new width
   * @param element Optional, an element to apply the width to, if not set will only update the width definitions.
   */
  updateWidth(width: string, element?: HTMLElement): void {
    const { isFixedWidth } = this._column;

    /*  Setting the minimum width is based on the input.
        If the original width is pixel fixed we will take the maximum between it and the min width.
        If not, we will the take minWidth.
        If none of the above worked we will try to see if the current width is set with %, if so it will be our min width.
    */
    const minWidthPx = isFixedWidth
      ? Math.max(this._column.parsedWidth.value, this._column.minWidth || 0)
      : this._column.minWidth
    ;

    let minWidth = minWidthPx && `${minWidthPx}px`;
    if (!minWidth) {
      const parsed = parseStyleWidth(width);
      if (parsed && parsed.type === '%') {
        minWidth = width;
      }
    }

    const maxWidth = isFixedWidth
      ? Math.min(this._column.parsedWidth.value, this._column.maxWidth || this._column.parsedWidth.value)
      : this._column.maxWidth
    ;

    this._widths = this._sWidths = [minWidth || '',  width, maxWidth ? `${maxWidth}px` : width];
    if (element) {
      this.applyWidth(element);
    }
  }

  /**
   * Apply the current width definitions (minWidth, width, maxWidth) onto the element.
   */
  applyWidth(element: HTMLElement): void {
    setWidth(element, this.widths);
  }

  /**
   * Query for cell elements related to this column definition.
   *
   * This query is not cached - cache in implementation.
   */
  queryCellElements(...filter: Array<'table' | 'header' | 'headerGroup' | 'footer' | 'footerGroup'>): HTMLElement[] {
    const cssId = `.${uniqueColumnCss(this)}`;

    const query: string[] = [];

    if (filter.length === 0) {
      query.push(cssId);
    } else {
      for (const f of filter) {
        switch (f) {
          case 'table':
           query.push(`.neg-table-cell${cssId}`);
           break;
          case 'header':
           query.push(`.neg-table-header-cell${cssId}:not(.neg-header-group-cell)`);
           break;
          case 'headerGroup':
           query.push(`.neg-header-group-cell${cssId}`);
           break;
          case 'footer':
           query.push(`.neg-table-footer-cell${cssId}:not(.neg-footer-group-cell)`);
           break;
          case 'footerGroup':
           query.push(`.neg-footer-group-cell${cssId}`);
           break;
        }
      }
    }
    // we query from the master table container and not CDKTable because of fixed meta rows
    return query.length === 0 ? [] : Array.from(this.extApi.element.querySelectorAll(query.join(', '))) as any;
  }

  /** @internal */
  ngDoCheck(): void {
    if (this._isDirty) {
      this._isDirty = false;
    }
  }

  /** @internal */
  ngOnDestroy(): void { this.detach(); }

  onResize(): void {
    if (isNegColumn(this.column)) {
      const prevNetWidth = this._netWidth;
      this._netWidth = this.extApi.dynamicColumnWidthFactory().widthBreakout(this.column.sizeInfo).content;

      if (prevNetWidth && prevNetWidth !== this._netWidth) {
        const width = `${this._netWidth}px`;
        this._widths = [
          this.widths[0] || width,  // min
          width,                    // width
          width,                    // max
        ];
      }
    }
  }

  private attach(column: T): void {
    if (this._column !== column) {
      this.detach();
      if (column) {
        this._column = column;
        (column as any).attach(this);
        this.name = column.id.replace(/ /g, '_');

        if (isNegColumn(column)) {
          this.sticky = this.stickyEnd = false;
          switch(column.pin) {
            case 'start':
              this.sticky = true;
              break;
            case 'end':
              this.stickyEnd = true;
          }
        }
      }

      if (this._colDiffer) {
        this.markForCheck();
      }
    }
  }

  private detach(): void {
    if (this._column) {
      this._column.detach();
      this._column = undefined;
    }
  }
}

/**
 * Set the widths of an HTMLElement
 * @param el The element to set widths to
 * @param widths The widths, a tuple of 3 strings [ MIN-WIDTH, WIDTH, MAX-WIDTH ]
 */
function setWidth(el: HTMLElement, widths: [string, string, string]) {
  el.style.minWidth = widths[0];
  el.style.width = widths[1];
  el.style.maxWidth = widths[2];
}
