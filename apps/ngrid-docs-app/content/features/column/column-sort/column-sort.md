---
title: Column Sort
path: features/column/column-sort
parent: features/column
ordinal: 4
---
# Column Sorting

In NGrid, column sorting is the re-ordering of datasource items based on **logic** and **sort order** (criterion).  

> This section covers the basics of sorting, custom sorting and programmatic sorting. For UI reactive sorting (click on header to sort) see the [sorting section](../../../plugins/ngrid-material/mat-sort) in the material plugin.

## Sort Order

The `sort order` defines the sort state (on/off) and logical order:

- **asc** - Ascending order (start to end, 1 to 10, A to Z)
- **desc** - Descending order (end to start, 10 to 1, A to A)
- `undefined` - Sorting is not enabled

## Sort Logic

The sort logic is where we determine if a value comes before or after another value.

For example, sorting a numeric column will be based on the decimal numeric system. Sorting of a textual column will be based on the alphabet order.

## Sorting Function

To sort a column a sorting function is **required**. The sorting function accepts the **column**, **sort order** & **data set** and returns a sorted data-set, it is the implementation of the sort logic.

```typescript
export interface PblNgridSorter<T = any> {
  (column: PblColumn, sort: PblNgridSortInstructions, data: T[]): T[];
}
```

I> The sorting function is **required** for every column we want to sort but there is a default sorting function attached to all sortable column if no custom one attached.

## Sortable Columns

By default, columns are not sortable, to enable sorting the `sort` property must be set on the column definitions:

```typescript
export interface PblColumnDefinition extends PblBaseColumnDefinition {
  // ...

  sort?: boolean | PblNgridSorter;

  // ...
}
```

Note that you can set a `boolean` or a sorting function (`PblNgridSorter`).

- If `true` is set, the column is marked sortable and no sorting logic is attached to it.
- If a sorting function is set, the column is marked sortable and the custom sorting logic is stored.

Wether `true` or a function is set, the sort function used is picked when sorting is applied. This is covered later in "Picking a Sorting function"

W> Note that defining `sort` for a column does not activate it, to activate a sorting for a column you need to use the API.

## Activating Sort for a Column

Column sorting can be activated 2 locations:

1. DataSource API
2. Grid Instance API

Both APIs are similar, with the Grid API adding some sugar on top of the DataSource API.

Let's take a quick look at the **DataSource API** signature:

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

The 1st signature is used for clearing up the current sort.  
The 2nd signature is used for defining a new sort.

The **Grid Instance API** is quite identical:

```typescript
  setSort(skipUpdate?: boolean): void;
  setSort(columnOrSortAlias: PblColumn | string, sort: PblNgridSortDefinition, skipUpdate?: boolean): void;
```

The difference is that we can provide a column id or alias instance of a column instance and the grid will find the instance for us and use
the DataSource API to activate the sort.

### Sorting Definitions

The 2nd parameter in `setSort` is the `PblNgridSortDefinition`:

```typescript
export interface PblNgridSortDefinition {
  order: PblNgridSortOrder;
  sortFn?: PblNgridSorter;
}
```

The sort definitions is made up of:

- **order** - The sort order we want to use ('asc' or 'desc')
- **sortFn** - The sort function (logic) we want to use (optional)

I> The **sortFn** is optional, see the "Picking a Sorting function" for more details.

## Picking a Sorting function

When sorting is applied the grid will search for a sorting function in the following order and choose the **first match**:

- `PblNgridSortDefinition.sortFn`
- The sorting function defined on the `sort` property of the column definition
- The default sorting function

In other words, providing a sorting function to `setSort` will override any sorting function defined on the column definitions.
If no function provided and no sorting function exists on the column definition, the default sorting function is used.

## The Default Sorting Function

The default sorting function is very simple, it uses the `<` and `>` operators to determine the logical order between 2 values. This is applied on all data types.

<div pbl-example-view="pbl-column-sort-example"></div>

<div pbl-example-view="pbl-column-specific-sorting-example"></div>

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
