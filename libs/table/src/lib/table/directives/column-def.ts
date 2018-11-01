// tslint:disable:use-host-property-decorator
import {
  Directive,
  Input,
  KeyValueDiffers, KeyValueDiffer,
  OnDestroy,
  DoCheck,
} from '@angular/core';
import { CdkColumnDef } from '@angular/cdk/table';

import { COLUMN } from '../columns';
import { isNegColumn } from '../columns/column';

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
    { provide: CdkColumnDef, useExisting: NegTableColumnDef }
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

  protected _colDiffer: KeyValueDiffer<any, any>;
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
  private netWidth?: string;

  constructor(protected readonly _differs: KeyValueDiffers) {
    super();
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

  updateWidth(width: string): void {
    const { minWidth, maxWidth } = this._column;
    this._widths = this._sWidths = [minWidth ? `${minWidth}px` : '',  width, maxWidth ? `${maxWidth}px` : width];
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
      const prevNetWidth = this.netWidth;
      const width = this.netWidth = this.column.sizeInfo.style.width;

      if (prevNetWidth && prevNetWidth !== width) {
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
        this.name = column.id;
        this.sticky = column.stickyStart;
        this.stickyEnd = column.stickyEnd;
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
