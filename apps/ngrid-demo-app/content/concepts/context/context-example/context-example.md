---
title: What is the Context
path: concepts/context/what-is-the-context
parent: concepts/context
tags: context, contextApi
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
