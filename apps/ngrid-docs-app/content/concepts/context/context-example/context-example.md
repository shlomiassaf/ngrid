---
title: What is the Context
path: concepts/context/what-is-the-context
parent: concepts/context
tags: context, contextApi, IntersectionObserver
ordinal: 1
---
# What is the Context

Each row in the grid has data, the row data is used to display the cells on each row.

In addition to the data each row has a context object which is used to store state about the row and the cells of the row.

## Why

Why do we need context? We need it so we can switch between various states a row/cell can be in and to persist that state.  
For example, the context will hold the **editing** state, indicating if a cell is currently in "edit" mode.

This is just a simple example, the context becomes powerful when we start showing a small subset of the entire row collection.  

I> I.E: When we use pagination, filtering and/or virtual scroll.

Let's explain with a simple example:

<div pbl-example-view="pbl-context-example-example"></div>

The grid above is using pagination to split the data collection into "pages".  
In addition, each cell under the **name** column can be edited when double clicking on it with the mouse.

When we active "edit" mode on a cell the context of the cell is updated and the edit flag is set to true.  
Now, when a cell is being editing, if we click on the pagination "next" button we will see all rows replaced with new rows, the edit is gone.  
Now, if we click the pagination "back" button we get back to our original view and now we see the edit back on, where we left it, thanks to the context.

This is also true when toggling the sort component (click on the "name" column)

## Context & Identity

To match context to a row, each row in the collection must be unique so when required we can easily match the row and the context.  
The order of the rows in the collection does not qualify, we've just seen how we can sort the collection creating a different order inside the collection.

We need to mark the column that reflects the uniqueness of each row as the [Identity Column](../../columns/identity).  

In the example above we've marked the `id` column as the identity column by adding `pIndex: true` to the column definition.

I> If there is no unique column context support is available but limited.

For example, if we remove the `pIndex` from the example above, each click for sort/pagination will clear the cache since
there is no way for the context to identify and match exiting context to rows.

## The Data Row Context

The data row context is the object which holds the state of a data row (including the row's data item) and some methods to operate on the context.

Let's first focus on the properties:

```typescript
export interface PblNgridRowContext<T = any> {
  /** Data for the row that this cell is located within. */
  $implicit?: T;
  /** Length of the number of total rows rendered rows. */
  count?: number;
  /** True if this cell is contained in the first row. */
  first?: boolean;
  /** True if this cell is contained in the last row. */
  last?: boolean;
  /** True if this cell is contained in a row with an even-numbered index. */
  even?: boolean;
  /** True if this cell is contained in a row with an odd-numbered index. */
  odd?: boolean;

  /** The identity of this row */
  identity: number;

  /**
   * When true, it is the first time that the row is rendered.
   * Once the row leaves the view this will be false and will not change.
   *
   * Note that rendered items might appear outside of the viewport if virtual scroll is not set and
   * when set but the row is rendered as part of the buffer.
   *
   * This is relevant only when virtual scroll is set.
   */
  firstRender: boolean;

  /**
   * When true, indicates that the row is rendered outside of the viewport.
   *
   * The indicator is updated when rows are rendered (i.e. not live, on scroll events).
   * Understanding this behavior is important!!!
   *
   * Note that when virtual scroll is enabled `true` indicates a buffer row.
   */
  outOfView: boolean;

  /** The index at the datasource */
  dsIndex: number;

  readonly grid: PblNgridComponent<T>;

  /**
   * Returns the length of cells context stored in this row
   */
  readonly length: number;
}
```

`$implicit` is the actual data row and the default property provided by angular.  
All other properties are straight forwards, let's see them in action:


<div pbl-example-view="pbl-context-object-example"></div>

> When using [virtual scroll](../../../features/grid/virtual-scroll/what-is-virtual-scroll), `count` represents the rendered rows, not the total rows.

I> `identity` is populated based on the [identity column](../../columns/identity), if none define the data index is used.

## Context Pitfalls

Some key points:

- Context is state and managing state, as we all now, is **hard**.
- **nGrid** is a composition of multiple features. Some interact with each other, some are native and some are plugins.

Depending on the complexity of each feature and the areas in which it has effect on, managing the context might be tricky.  

For example, filtering is an operation which modifies the existing dataset.  
From here, things diverge based on the components used in **nGrid**.

If the datasource implementation handles filtering on the **server** the entire datasource is replaced on each filtering operation.  
However, when filtering is done on the existing datasource, it is kept in memory but only a portion of it is actually used.

Each behavior impact the context differently. Filtering on the server will clear the context, filtering on the client will keep it.

Additional features on top of the above? more complexity!

For example, the `Dynamic Virtual Scroll` strategy is sensitive to filtering, regardless of it's origin, other virtual scroll strategies might be less sensitive.
It is all based on the implementation.

In general, virtual scroll operations and different datasource implementations (e.e. Infinite Scroll) might have context specific behaviors.  
Read the documentation of the features you use for more information.

