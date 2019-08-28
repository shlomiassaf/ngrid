---
title: Grid Filler
path: features/grid/grid-filler
parent: features/grid
ordinal: 8
---
# Grid Filler

The table's background is transparent, when the total height of the rows is lower then the height available this is visible.

The filler is a `<div>` that is added at the bottom of the grid and takes up
the height left.

You can customize it's background through the CSS class `pbl-ngrid-space-fill`

I> You can also solve this by assigning a background color to the table but this is not always suitable.

## Filler with Virtual Scroll

In the following example the table is rendered inside a div container that has a `lightgreen` background color.

<div pbl-example-view="pbl-grid-filler-example"></div>

**The same thing, now with fixed mode virtual scroll**

<div pbl-example-view="pbl-grid-filler-fixed-virtual-scroll-example"></div>

## Disabling the Filler

You can disable the filler using the binding attribute `noFiller`

<div pbl-example-view="pbl-grid-filler-disabled-example"></div>

## Filler and No Virtual Scroll

W> Currently, the filler is not supported when virtual scroll is disabled (`vScrollNone`)

<div pbl-example-view="pbl-grid-filler-no-virtual-scroll-example"></div>
