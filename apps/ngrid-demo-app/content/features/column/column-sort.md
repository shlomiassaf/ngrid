---
title: Column Sort
path: features/column/column-sort
parent: features/column
---
# Column Sorting

Column sorting is activated and configured in 2 locations:

1. DataSource (API)
2. Grid instance (API)

In addition, you can configure a column specific sorting behaviour in the column definitions.

## Column definitions

In the **Column** definitions we define if the column is sortable and optionally how to sort it.

```typescript
export interface PblColumnDefinition extends PblBaseColumnDefinition {
  // ...

  sort?: boolean | PblNgridSorter;

  // ...
}
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

W> Note that defining `sort` for a column does not activate it, to activate a sorting for a column you need to use the API.

## DataSource (API)

Through the datasource (`PblDataSource`) we define the sorting programmatically.

We can define the current sorted column, the direction of the sort (`asc` or `desc`) and an optional custom sort logic.

If we don't supply any of those, it will just clear the active sort.

```typescript
  /**
   * Clear the current sort definitions.
   * @param skipUpdate When true will not update the datasource, use this when the data comes sorted and you want to sync the definitions with the current data set.
   * default to false.
   */
  setSort(skipUpdate?: boolean): void;
  /**
   * Set the sorting definition for the current data set.
   * @param column
   * @param sort
   * @param skipUpdate When true will not update the datasource, use this when the data comes sorted and you want to sync the definitions with the current data set.
   * default to false.
   */
  setSort(column: PblColumn, sort: PblNgridSortDefinition, skipUpdate?: boolean): void;
```

### Grid instance (API)

The grid instance API is just sugar around the datasource API, allowing you to reference columns by their **id** or **alias**.

Internally, it will resolve the column instances and call the datasource API.

<blockquote class="info icon">
  <div class="icon-location"></div>
  This section deals with the programmatic approach to sorting. For UI reactive sorting (click on header to sort) see the <a [routerLink]="['../..', 'extensions', 'mat-sort']">sorting section</a> in the material plugin.
</blockquote>

<div pbl-example-view="pbl-column-sort-example"></div>

## Aliasing

Aliasing is just another way to reference a column indirectly (i.e. not through it's object reference).

First, let's review the the basic indirect column reference, `id`:

### The `id` reference

Each column has an `id` property that is used to uniquely identify the column.
The `id` property is **optional**, when not set the grid will automatically assign the value provided in `prop` (which should be unique).

For example:

- If we set **prop** to `age` but don't set **id**, **id** will be `age`.
- If we set **prop** to `info.age` but don't set **id**, **id** will be `info.age`.
- If we set **pro** to `age` and **id** to `age_column`, **id** will be `age_column`.

In most cases, setting the **id** specifically is not required, redundant and verbose with no gain.  
However, in some cases, you might want to set **id** if the **prop** does not reflect a real property (virtual column).

### The `alias` reference

Alias is a property in the column definition (`alias`) that creates an alias id to the column so you can use it as another reference.

It is very similar to **id** but:

- It is not auto populated when not set
- It is not used by the `ColumnApi` when searching for a column

The **alias** property is used to reference column in specific APIs like `PblNgridComponent.setSort` and `PblNgridComponent.setFilter`.

In those APIs **alias** has priority, if set it will be used exclusively in the searching otherwise, when not set, **id** is used.

Using **id** entirely, ignoring **alias**, is possible and will work. The **alias** property exist to create a clear separation between
logical units such as server and client when sorting and filtering operations are involved.

For example, it is useful if you get list of sortable columns from the server which does not match the actual ids of the column like when using dot path notation in **prop** or
when the server `sortBy` descriptors does not match the column names.

Of course, you can also use **id** in this case, but **alias** is more descriptive and logically separated when trying to understand the structure.
