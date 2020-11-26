---
title: What is Virtual Scroll?
path: features/grid/virtual-scroll/what-is-virtual-scroll
parent: features/grid/virtual-scroll
ordinal: 0
---
# Virtual Scroll Basics

Displaying rows, rendering and keeping them synced is an expansive task. Adding more columns equals more work.

If our dataset contains 100 rows & 5 columns, displaying them is not an issue.  
Now, a new dataset with 100,000 rows. That's **at minimum** 600,000 DOM elements, 100K rows + 500K cells.

In reality, the browser will start showing slow initial loading at 500 rows and hang at 1000+ and that's only 5 columns!  
When we think about it, why do we need to render all rows? the user can only see several rows at a time.

To solve this issue we apply **virtual scrolling**, a technique that renders only the visible rows (plus additional row for buffering).  
All other rows are emulated (virtualized) and only when the user scroll's the context of each row is swapped but we usually don't
generate new rows.

We only show a small portion of data at a given time.  
Other items should be emulated (virtualized) via elements that create empty space, which are empty but have some height necessary to provide consistent scrollbar parameters.  
Each time the user scrolls out of the set of visible items, the content is rebuilt: new items are fetched and rendered, old ones are destroyed, padding elements are recalculated, etc.

I> For an in-depth tutorial, see [this blog post](https://blog.logrocket.com/virtual-scrolling-core-principles-and-basic-implementation-in-react/)

As always, there are challenges. At the start, we start with 100K rows, let say we render 10 but to display the scrollbar properly
we need to estimate the total length of the remaining 99,990 row we still didn't render. As the user scrolls we need to
determine the next subset of rows to fetch.

If we know that all rows have a fixed height we can apply specific logic, if we need to automatically calculate the heights we will apply a different logic.  
We call the different logics **strategies**.

**nGrid** comes with 3 built-in strategies, suitable for different scenarios.

I> You can provide a custom strategy if you have one, however this is usually complicated.

I> Logic by itself is not enough, the strategy must be able to cope with other elements in the grid, such as header, sticky rows, etc..

<div pbl-example-view="pbl-virtual-scroll-example"></div>
