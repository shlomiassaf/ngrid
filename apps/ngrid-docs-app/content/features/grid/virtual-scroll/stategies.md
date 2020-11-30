---
title: Strategies
path: features/grid/virtual-scroll/strategies
parent: features/grid/virtual-scroll
ordinal: 1
---
# Virtual Scroll Strategies

## Built-in Strategies

**nGrid** comes with 3 built-in strategies

- **vScrollFixed**: The size of all rows are fixed and equal.
- **vScrollAuto**: The size the rows is not guaranteed to be equal.
- **vScrollDynamic**: The size the rows is not guaranteed to be equal.

And a special **vScrollNone** strategy which **disable** virtual scrolling.

You can quickly attach a strategy using a directive:

```html
<pbl-ngrid vScrollAuto></pbl-ngrid>

<pbl-ngrid vScrollFixed></pbl-ngrid>

<pbl-ngrid vScrollDynamic></pbl-ngrid>

<pbl-ngrid vScrollNone></pbl-ngrid>
```

You can also apply a strategy globally, for all instances of **nGrid** which is why **vScrollNone** exists.  
In fact, by default, **nGrid** is configured to use the **vScrollAuto** strategy so `<pbl-ngrid></pbl-ngrid>` is similar to `<pbl-ngrid vScrollAuto></pbl-ngrid>`

### Fixed Size Strategy [vScrollFixed]

In most scenarios, the grid will have a fixed height fow all rows.  
This is a common scenario because the human brain works better with repetitive patterns.

Fixed size strategy is simple, relative to other strategies, and predictive.  
If each row is 50px high and we have 1000 rows, the total height is 50,000px.  
Find the index of the row at 20,000px is also simple, 20,000 / 50 = **400**

Fixed size strategy is simple math with no DOM interaction, no layout information is required from the DOM.  
This is why it is also has the best performance!

I> Fixed Size strategy is part of the `@angular/cdk/scrolling` package, wrapped and modified by **nGrid**

<div pbl-example-view="pbl-fixed-size-example"></div>

### Different Height Strategies

When the height of the rows are not equal, using fixed size will not work.  
Here we need a different approach, one that involves sampling of the rows we have available and with them estimating the heights.  
At each scroll iteration we re-evaluate the estimations and correct where necessary, fine tuning our predication with every step.

For estimations we first need data and because height's are unknown and math alone is not enough.  
we query the DOM to get the current layout, which  can be the height of the container or the height of each row.  
This is an expansive operation which is why these strategies perform slightly less then the fixed size strategy.

**nGrid** has 2 built in strategies in this category:

- **vScrollAuto**
- **vScrollDynamic**

#### Auto Size Strategy [vScrollAuto]

The Auto Size strategy is based an averaging row heights and fine-tune it on every render cycle (new rows enter the viewport).  
Instead of sampling the height for each row it only samples the height of the container and divide it by the number of rows rendered.  
This returns the average size of the currently rendered rows. On each scroll it will perform a check to see if we need to add items at each edge.

The use of average is the key to understand where this strategy works best and where not.
Once a prediction is missed the logic perform small correction, a miss means deviating from the average.  
So Auto Size works best when we might have from 0 to **a lot** of variations between the rows but the range of the deviation between the rows should be small.

If we have a large bump (i.e. 500 px) it will notice and it will require several scroll cycles to correct and adjust to.

I> Auto Size strategy is part of the `@angular/cdk-experimental/scrolling` package, wrapped and modified by **nGrid**

<div pbl-example-view="pbl-auto-size-example"></div>

In the example above the `bio` column, having a lot of content, defines the final height of each row.  
It's completely random, hance perfect for an average based algorithm.

#### Dynamic Size Strategy [vScrollDynamic]

The Dynamic Size strategy assumes **most rows** have the same height and there are some rows which might have small or very large gaps.  
You can think of it as Fixed strategy with monitoring, making sure that rows with a different height are factored in.

To do so, it starts with a default row height which you can provide and if not it is the height of the first row.  
As the user scrolls it will keep track of all rows with different heights then the default row height.  

Only rows with different heights are stored and since we don't expect a lot of them it shouldn't impact performance.  
The data structure used for this is based on ordered (sorted) fixed size chunks where each chunk "represent" the same amount of rows.

For example, for a dataset of 1000 rows with a chunk size of 50, we will have 20 chunks, ordered based on the row order.  
A chunk will only store metadata about rows that have a size different then the default, otherwise they are not added/removed.  
If a chunk had a single row and it was removed, the whole chunk is removed as well.  
Removed chunks still exists virtually, but we don't need them to be able to calculate their height, it's dead simple: `20 rows in a chunk * default height`  
Chunks with items in them cache the total height so they are also quick to measure.
The only "tricky" part is to calculate a partial range of a chunk or a range touching more then 1 chunk.

Because chunks are sorted we use binary search for all of our calculations.  
If we take into account that most chunks are empty, most existing chunks have very few items and that each calculation is usually between 2 chunks
we can expect fast and accurate results even when working with rows with large gaps (50px vs 600px).

Because the default base height is fixed this strategy will not perform well in a grid with chaotic height distribution as demonstrated in the Auto Size strategy above.

<div pbl-example-view="pbl-dynamic-size-example"></div>

In the example above, a detail row is implemented (via row click) which is significantly larger then the row size.  
The Dynamic strategy captures new size additions and store them while removing size records from closed detail rows.  

We are using the [Detail Row](../../../built-in-plugins/detail-row) plugin here, along with animations making
sure (see the HTML) height updates are sampled only when animation is done.

The **Detail Row** plugin is smart enough to let us know when animation is not requires because the row's context
has switched between DOM elements and the close/open event is not in place. It will instead just move the elements
to the new row for us. Moreover, if an opened row was scrolled out of view into the virtual void it's height is
stored and reflected in the total, once we scroll back into it, it will be rendered in an open state, again with no animation!

W> The Dynamic Strategy will reset the total size and all size marks to 0 when filtering

> Moving forward, the Dynamic Strategy will update, improving it's accuracy based on experience.
For example, instead of using a default size we can fine-tune it to an average.

## Configure A Global / Default Strategy

The global strategy set by default to all instances of **nGrid** is `vScrollAuto`.  
If a virtual scroll strategy is not set the global strategy will be used.

You can configure the global strategy with `PblNgridModule.forRoot`:

```typescript {10,21}
import { NgModule } from '@angular/core';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';
import { PblNgridModule, NoVirtualScrollStrategy } from '@pebula/ngrid';

// DISABLING VIRTUAL SCROLL

@NgModule({
  imports: [
    PblNgridModule.forRoot({
      defaultStrategy: () => new NoVirtualScrollStrategy()
    })
  ]
})
export class TablesWithoutVirtualScrollModule { }

// FIXED SIZE VIRTUAL SCROLL

@NgModule({
  imports: [
    PblNgridModule.forRoot({
      wheelMode: 18, // default wheel mode
      defaultStrategy: () => new FixedSizeVirtualScrollStrategy(48, 100, 200);
      // Init with undefined instead of 48 to have the height automatically set from the first rendered row.
    })
  ]
})
export class TablesWithFixedVirtualScrollModule { }
```

I> Using `NoVirtualScrollStrategy` as the default strategy will disable virtual scroll globally unless explicitly defined per grid

