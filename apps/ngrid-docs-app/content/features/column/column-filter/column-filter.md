---
title: Column Filter
path: features/column/column-filter
parent: features/column
ordinal: 3
---
# Column Filtering

Column filtering can be set / configured in 2 locations:

1. DataSource (API)
2. Grid instance (API)

In addition, you can configure a column specific filtering behaviour in the column definitions.

<blockquote class="warn icon">
  <div class="icon-location"></div>
  This page refer to client-side filtering where filtering is done in the browser and not on the server. For more information read the <a [routerLink]="['../..', 'concepts', 'datasource-quickthrough']" fragment="client-side">datasource quick-through</a>.
</blockquote>

## Activating a filter

Activation is done through one of the APIs (DataSource or Grid).

There are 2 filter types:

- Value filter
- Predicate filter

**Value filter** is managed by the grid, we are activating the filter by providing a value that we want to find a match to in one or more columns.
If the value has a match the row will pass the filter, otherwise it will get filtered out.

**Predicate Filter** is un-managed, we have full control over the filtering process. We provide a predicate function that accepts a row
and a collection of columns and return `true` if the row passed the filter and `false` if not.

I> In the most basic level all filters are `predicates`, the `value` filter is just an API to organize and simplify the use of function predicates.

## Value Filter

The value filter approach is simple and consistent across grid's.
It relays on pre-defined filtering behaviour which is used to filter the value.

The grid comes with one pre-defined behaviour that compares the inclusion (text) of the provided value in a column value.
For example, if the filter value is "oh" and the value in the column `name` for a given row is "John", it will pass the filter.

Here we search for `oh` in either column `name` or `email`:

```typescript
grid.setFilter('oh', ['name', 'email']);
```

I> In the example above me make use of the `Grid instance (API)`, which allows us to provide a string reference to a column

Of course, this is too generic, filtering the value **11** will return `211`, `11`, `341123`, etc...

### Value filter behaviour

To really leverage the value filter we need to control how certain column filter certain values.

This is done in the column definition, where we can set the `filter` property which will act as a predicate
specifically for the column it is defined on.

```typescript
export interface PblColumnDefinition extends PblBaseColumnDefinition {
  // ...

  /**
   * A custom predicate function to filter rows using the current column.
   *
   * Valid only when filtering by value.
   * See `PblDataSource.setFilter` for more information.
   */
  filter?: DataSourceColumnPredicate;
  // ...
}
```

The definition for `DataSourceColumnPredicate`:

```typescript
/**
 * A function the return true then the value should be included in the result or false when not.
 * This is a single column filter predicated, returning false will filter out the entire row but the
 * predicate is only intended to filter a specific column.
 */
export type DataSourceColumnPredicate = (filterValue: any, colValue: any, row?: any, col?: PblColumn) => boolean;
```

A function that accept a `filterValue` (the value to filter by), a `colValue` (the value of the cell for the column for a given row), the row and the column instance.

For example, a numeric filter:

```typescript
const numericFilter = (filterValue: number, colValue: number) => filterValue === colValue
```

Now, let's build a numeric range filter:

```typescript
const numericFilter = (filterValue: number, colValue: number) => colValue > ???  && colValue < ???
```

We're stuck, we need the min / max value of the range. The `filterValue` does not have to be of the same type of the column we're filtering...

```typescript
const numericRangeFilter = (filterValue: { min: number, max: number }, colValue: number) => colValue > filterValue.min && colValue < filterValue.max
```

Which we will activate like this:

```typescript
grid.setFilter({ min: 21, max: 120 }, ['age']);
```

These are simple examples, they can be extended per your requirements, using a dedicated library or your own custom logic.

### Real-world value filters

As you might have realized by now, value filters are powerful because they allow to create a reusable filtering system
for the entire app without much effort.

Combined with the `type` property you can automate the assignment of filters based on types.

I> In the future, we hope to release a column pack package with pre-defined sorting and filtering predicates attached to
pre-defined types.

### Value filter cons

Currently, you can't join 2 (or more) values filters into a single AND or OR expression

<div pbl-example-view="pbl-column-filter-example"></div>

## Predicate Filter

The predicate filter is the "hands-on" manual approach.

Instead of accepting a value, it accepts a function of type `DataSourcePredicate`:

```typescript
/**
 * A function the return true then the row should be included in the result or false when not.
 * @param row The row in the data source that the filter apply on
 * @param properties A list of column instances (`PblColumn`) to filter values by.
 */
export type DataSourcePredicate = (row: any, properties: PblColumn[]) => boolean;
```

Like the value filter predicate function (`DataSourceColumnPredicate`) its job is to determine if a row is passed
the filter or not (filtered out).

However, value filter predicates work on the column level, a specific column in a row.

Here we work on the row level, the grid will provide the rows to the filter, one by one, including the columns participating the in filtering process.
The filter is responsible from here, for the entire row including it's columns.

In most cases, value filters will do the job, but for more complex scenarios we can use the predicate filter.

<p>A good example for predicate filtering in action is <a [routerLink]="['../..', 'stories', 'multi-column-filter']">the multi-column filter</a> which demonstrate
filtering using 2 (or more) columns at the same time.</p>

I> Value filters are implemented using a special predicate filter that manage the process.

### Syncing the filter

Syncing the filter is simply re-running the filtering process with the current filter registered.

Calling `setFilter` with the same filter function will not work because the filter is cached.

```typescript
grid.setFilter({myPredicateFunction, ['age']);
```

Instead, use:

```typescript
grid.ds.syncFilter();
```

You might ask why a re-running the filter is needed? great question!

If you're running a value filter then no, you don't need to sync the filter, just call `setFilter` with the new value.

If you're running a predicate filter, use the `syncFilter` to re-run the filter when the value changes. In predicate filter there is
no "value" to filter by, you provide it so a mechanism to update the filter based on value updates is required.

The the multi-column filter example (link above) makes use of `syncFilter`.

## Clearing The filter

To clear the current filter call the `setFilter` method with no parameters

```typescript
grid.setFilter();
```

## Accessing Filtered Data

The data store holds the last filtered subset, located in `PblDataSource.filteredData`.

The `filteredData` property will always return an array, either empty or populated.
