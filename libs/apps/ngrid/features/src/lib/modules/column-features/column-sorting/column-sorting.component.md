# Column Sorting

Column sorting is configured in 2 places:

1. Column definitions
2. DataSource

In the **Column** we define if the column is sortable and optionally how to sort it.

```typescript
export interface PblColumnDefinition extends PblBaseColumnDefinition {
  // ...

  sort?: boolean | PblNgridSorter;

  // ...
```

Setting `sort: true` will mark the column as sortable and the sort logic is to be sent when setting the current sort.

Or, we can provide a sorting logic for the column via `PblNgridSorter`:

```typescript
export type PblNgridSortOrder = 'asc' | 'desc';

export interface PblNgridSortInstructions {
  order?: PblNgridSortOrder;
}

export interface PblNgridSorter<T = any> {
  (column: PblColumn, sort: PblNgridSortInstructions, data: T[]): T[];
}
```

In the datasource we define the current sorted column, the direction of the sort (`asc` or `desc`) and an optional custom sort logic.

<blockquote class="info icon">
  <div class="icon-location"></div>
  This section deals with the programmatic approach to sorting. For UI reactive sorting (click on header to sort) see the <a [routerLink]="['../..', 'extensions', 'mat-sort']">sorting section</a> in the material plugin.
</blockquote>

<docsi-mat-example-with-source title="Programmatic Sorting" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid blockUi [dataSource]="ds" [columns]="columns"></pbl-ngrid>

  <div fxLayout="row" fxLayoutGap="16px" style="padding: 8px">
    <button *ngFor="let key of ['id', 'name', 'gender', 'birthdate']"
            fxFlex="noshrink" mat-stroked-button color="primary" (click)="toggleActive(key)">{{ key }} [{{ getNextDirection(key) }}]</button>
    <div fxFlex="*"></div>
    <button fxFlex="noshrink" mat-stroked-button color="accent" (click)="clear()">Clear</button>
  </div>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

## Sort Alias

Sort alias is a property in the column definition (`sortAlias`) that creates an alias id to the column so you can
use it as a reference to the column when calling `PblNgridComponent.setSort`.

This is useful if you get list of sortable column from the server which does not match the actual ids of the column.  
For example, when using dot path notation.
