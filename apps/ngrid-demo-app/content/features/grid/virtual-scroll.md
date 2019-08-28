---
title: Virtual Scroll
path: features/grid/virtual-scroll
parent: features/grid
ordinal: 4
---
# Virtual Scroll

Virtual scroll will make sure that the table will only render the rows that are visible (plus some buffer rows) and update them
when the user scroll.

The visible rows in a table are the rows that fit in a table's **viewport**. In other words, the amount of row's we can fit
in the total height of the table.

To calculate the amount of rows that fit in a given height we need:

1. The height of the row
2. The total height of the table

The total height is constant (when scrolling) so the height of the row will determine the amount of rows that fit.

## Row Height Strategy

There are 3 strategies, 2 for finding the row height:

- **vScrollFixed**: Fixed size strategy. The height is fixed for all rows
- **vScrollAuto**: Auto size strategy. The table will calculate the average height based on the actual rows

I> Whenever the row height in your table's is fixed, use the fixed height strategy.

And one for disabling virtual scroll: **vScrollNone**.

## Assigning a strategy to a table

Each strategy is also a directive that we can use to apply a strategy on a table

```html
<pbl-ngrid vScrollAuto></pbl-ngrid>

<pbl-ngrid vScrollFixed="48"></pbl-ngrid>

<pbl-ngrid vScrollNone></pbl-ngrid>
```

<div pbl-example-view="pbl-virtual-scroll-example"></div>

## Global Strategy (default)

The global strategy for all tables is `vScrollAuto`. If a virtual scroll strategy is not set the global strategy is used.

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
    })
  ]
})
export class TablesWithFixedVirtualScrollModule { }
```

I> `NoVirtualScrollStrategy` is a mode that disable virtual scroll

## Setting the Table Height

Virtual scroll requires a table with an explicit `height` value set (style/css). All valid units are good (%, px, etc..).

W> If a height is not explicitly set the table's height will be 0.

I> Without virtual scroll, not having a height will result in a height equal to the sum of all rows.
With virtual scroll we calculate how many rows fit in a given height, hence **we need a the height pre-hand**. We can't
let the row's define it.

## Detecting Scrolling State

When rows are scrolled vertically the *scrolling* state is turned on. Detecting changes in the scrolling state is supported through:

### `(scrolling)` Event

Event emitted when the scrolling state of rows in the table changes.

When scrolling **starts** `true` is emitted and when the scrolling **ends** `false` is emitted.

### CSS Class

When scrolling starts the CSS class `pbl-ngrid-scrolling` is added to the table (`pbl-ngrid`) and when scrolling ends the CSS class is removed.

I> The CSS flag is mostly used for plugins, cell template packs, etc. It requires disabling of component `encapsulation`, less suitable
for application components.

<div pbl-example-view="pbl-scrolling-state-example"></div>

## Performance

Without virtual scrolling, loading a datasource with 10,000 rows will takes a lot of time and will probably freeze the browser.

With virtual scrolling loading is instant but it does not come for free, when scrolling the table will calculate the new scroll position matching
it to the rows that should appear in that scroll offset and render them on page.

When the offset is changing gradually the performance impact is minimal but when the change is rapid with large gaps there might be performance issues.

I> Performance issues means lower frame rate, which happens when it takes more time to render new rows. This is why larger offset means less performance
because more rows are rendered on each scroll.

Rapid scrolling with large offsets can occur when scrolling with the **wheel** or in mobile with **touch move**.

In most browsers, when rendering takes more time the end result is an empty table while scrolling. The rows we had at the start are long out of the view but new rows
did not have the time to render in the frame.

W> **wheelMode** works for wheel events, its does not apply for touch events. Messing around with touch behavior on mobile devices will
make the scrolling behavior feel un-natural. Scrolling in touch devices, using touch is always passive.

To tackle this the `[wheelMode]` mode directive offers 3 strategies:

### Passive (default)

Do nothing, let the browser handle the rendering and if no rows are shown while browsing let it be.

### Blocking

Do not let the browser scroll until all rows in the current offset are rendered.

This will result in a lower scrolling speed with the wheel but with a scrolling UX behavior. The scrolling speed
depends on the frame rate, at 60FPS you will not feel a thing but at 5 FPS the experience is bad.

### Threshold

Provide a frame rate threshold that define when to use **Passive** mode and when to use **Blocking** mode.

Each scrolling events start with the **Blocking** behavior but when the frame rate drops below the threshold the behavior
switch's to **Passive**.

It is always preferred to render at 60FPS but sometimes it is not possible and we can compromise on lower frame rate in favor of a real UI scroll feel.

Like all trade-offs, it is best to meet at middle ground. Provide a **threshold** within your limits, usually between 15 FPS to 25 FPS.

I> Measuring performance is tricky as it depends on the CPU power of the host, the complexity of the cells, the size of the viewport (row count) and the scroll speed.
Try to avoid complex cells, **Blocking** behavior and low **threshold** values.

<p>For a live example see the <a [routerLink]="['../../', 'demos', 'virtual-scroll-performance']">virtual scroll performance</a> demo.</p>

## Horizontal scrolling

Virtual scroll currently support vertical scrolling, horizontal scrolling is not supported at the moment.
