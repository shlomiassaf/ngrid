# Focus And Selection

**Focus** and **Range Selection** is supported programmatically (`ContextApi`) and through the UI (mouse/keyboard) using the `target-events` plugin.

---

In most cases you will not need to use the API, the `target-events` plugin will usually have everything you need
including focus support via keyboard arrows as well as selection support using arrows & SHIFT, mouse & SHIFT, mouse   CTRL and mouse drag.

You can keep on reading or you can go to the `target-events` page for more details on focus & selection using the plugin
<p>You can keep on reading or you can <a [routerLink]="['../..', 'features', 'target-events']">go to the target-events page</a> for more details on focus & selection using the plugin</p>

---

## Using the API

The state of the currently focused cell is stored in the context of each cell and managed by the context API.
We'll start with direct API manipulation, we use the context API (`PblNgridContextApi`):

### Focus

```typescript
interface PblNgridContextApi<T = any> {
  // ...


  /**
   * The reference to currently focused cell context.
   * You can retrieve the actual context or context cell using `findRowInView` and / or `findRowInCache`.
   *
   * > Note that when virtual scroll is enabled the currently focused cell does not have to exist in the view.
   * If this is the case `findRowInView` will return undefined, use `findRowInCache` instead.
   */
  readonly focusedCell: GridDataPoint | undefined;

  /**
   * Focus the provided cell.
   * If a cell is not provided will un-focus (blur) the currently focused cell (if there is one).
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   */
  focusCell(cellRef?: CellReference | boolean, markForCheck?: boolean): void;

  // ...
}
```

Note that `CellReference` can be an `HTMLElement` of the cell, the context of the cell of a pointer to the cell (`GridDataPoint`)

```typescript
export type CellReference = HTMLElement | GridDataPoint | PblNgridCellContext;

/**
 * A reference to a data cell on the grid.
 */
export interface GridDataPoint {
  /**
   * The row identity.
   * If the grid was set with an identity property use the value of the identity otherwise, use the location of the row in the datasource.
   */
  rowIdent: any;
  /**
   * The column index, relative to the column definition set provided to the grid.
   * Note that this is the absolute position, including hidden columns.
   */
  colIndex: number;
}
```

> `GridDataPoint` is also used in other places to point to a cell.

I> When using `identityProp` to define a primary key for your models (which is highly recommended) the `rowIdent` that should be used is
the identity value, otherwise use the index position in the datasource.

Now, using it straight forward:

```typescript
gridInstance.contextApi.focusCell({ rowIdent: 3, colIndex: 2 }, true);
// Set the focus to the cell at 4th row and the 3rd column and mark the row to change detection.


// To clear the focus: (true is optional);
gridInstance.contextApi.focusCell(true);
```

### Range Selection

Range selection is similar to focus:

```typescript
interface PblNgridContextApi<T = any> {
  // ...

  /**
   * The reference to currently selected range of cell's context.
   * You can retrieve the actual context or context cell using `findRowInView` and / or `findRowInCache`.
   *
   * > Note that when virtual scroll is enabled the currently selected cells does not have to exist in the view.
   * If this is the case `findRowInView` will return undefined, use `findRowInCache` instead.
   */
  readonly selectedCells: GridDataPoint[];

  /**
   * Select all provided cells.
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   * @param clearCurrent Clear the current selection before applying the new selection.
   * Default to false (add to current).
   */
  selectCells(cellRefs: CellReference[], markForCheck?: boolean, clearCurrent?: boolean): void;
  /**
   * Unselect all provided cells.
   * If cells are not provided will un-select all currently selected cells.
   * @param cellRef A Reference to the cell
   * @param markForCheck Mark the row for change detection
   */
  unselectCells(cellRefs?: CellReference[] | boolean, markForCheck?: boolean): void;

  // ...
}
```

There are 2 notable differences:

- We have 2 APIs, one to add/set the range and one to clear it (all or partial).
- We now work with multiple cells and not one (it's a range...)

The cells within a range does not have to be connected (adjacent), we can have a range that is spread across. The range collection is
not organized nor sorted in any way.

I> The currently focused cell is also a selected cell.

Now, using it straight forward:

```typescript
gridInstance.contextApi.selectCells([ { rowIdent: 3, colIndex: 2 }, { rowIdent: 3, colIndex: 3 } ], true);
// Set the selected range to the cells at 4th row and the 3rd & 4 columns and mark the row to change detection.


// To clear the entire selection: (true is optional);
gridInstance.contextApi.unselectCells(true);

// To clear part of the selection: (true is optional);
gridInstance.contextApi.unselectCells([ { rowIdent: 3, colIndex: 2 } ], true);
```

## Navigating with primary index (`identityProp`)

Most of the operations in focus & selection require a reference to cell (any by that we also get the reference to the row).
We saw that `CellReference` is used for that and it can be the cell's `HTMLElement` or direct context instance.

In most cases, however, you will work with `GridDataPoint` because it is more simple to use and does not require a hard reference to an
existing object (`HTMLElement` or `PblNgridCellContext`).

When a primary index **is not used** providing a reference to a cell is straight-forward:

```typescript
const cellRef: GridDataPoint = { rowIdent: 3, colIndex: 2 };
```

Both row and col are referenced by their positional index, so `rowIdent: 3` means the 4th item (0 based) in the grid's datasource.

But how does it work when we do set `identityProp` (primary index)? for example, if our primary index is the social ID field?

```typescript
const cellRef: GridDataPoint = { rowIdent: '0879846579', colIndex: 2 };
```

Great, now if we want to reference the next or previous column we just modify `colIndex`.
But what if we want to get the next or previous row? since `rowIdent` is a key we cant use simple math.
We could start searching the datasource, but that's not a good idea as it's an array thus not indexed...

The API can help us:

```typescript
interface PblNgridContextApi<T = any> {
  // ...

  /**
   * Try to find a specific row context, using the row identity, in the context cache.
   * Note that the cache does not hold the context itself but only the state that can later be used to retrieve a context instance. The context instance
   * is only used as context for rows in view.
   * @param rowIdentity The row's identity. If a specific identity is used, please provide it otherwise provide the index of the row in the datasource.
   * @param offset When set, returns the row at the offset from the row with the provided row identity. Can be any numeric value (e.g 5, -6, 4).
   * @param create Whether to create a new state if the current state does not exist.
   */
  findRowInCache(rowIdentity: any, offset: number, create: boolean): RowContextState<T> | undefined;

  // ...
}
```

And using it:

```typescript
const cellRef: GridDataPoint = { rowIdent: '0879846579', colIndex: 2 };
const rowContextState = gridInstance.contextApi.findRowInCache(cellRef.rowIdent, -1, true);
const newCellRef: GridDataPoint = { rowIdent: rowContextState.identity, colIndex: cellRef.colIndex };
```

We started with a `GridDataPoint` and used it as a relative base point to get the previous row context state.
We set `true` in the last parameter to instruct the grid to create a new context state if one does not exist.  
In the final step we create the new grid data point that is pointing where we want.

## Example

The following example will demonstrate everything covered up to this point:

<docsi-mat-example-with-source title="Focus & Selection with API" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid #grid class="pbl-ngrid-cell-ellipsis" blockUi [dataSource]="ds" [columns]="columns"></pbl-ngrid>

  <div fxLayout="column" fxLayoutGap="16px">
    <div fxLayout="row" fxLayoutGap="16px">
      <button mat-flat-button color="primary"
              (click)="grid.contextApi.focusCell({ rowIdent: fRow.value, colIndex: fCol.value }, true)">Set Focus:</button>
      <mat-form-field>
        <mat-label>Row To Focus</mat-label>
        <mat-select #fRow>
          <mat-option *ngFor="let item of ds.source; index as index" [value]="index">
            {{ item.id + ' - ' + item.name}}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Column To Focus</mat-label>
        <mat-select #fCol>
          <mat-option *ngFor="let item of columns.table.cols; index as index" [value]="index">
            {{ item.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div fxLayout="row" fxLayoutGap="16px">
      <button mat-flat-button color="primary"
              (click)="applyRange(grid, fRange.value)">Set Range:</button>
      <mat-form-field>
        <mat-label>Range Size</mat-label>
        <mat-select #fRange>
          <mat-option [value]="1">1 X 1</mat-option>
          <mat-option [value]="2">2 X 2</mat-option>
          <mat-option [value]="3">3 X 3</mat-option>
          <mat-option [value]="0">Clear</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  </div>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>


