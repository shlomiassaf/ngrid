---
title: Layout
path: features/grid/virtual-scroll/layout
parent: features/grid/virtual-scroll
ordinal: 2
---
# Virtual Scroll Layout

## Setting the Grid's Height

With virtual scroll, the data rows of the grid have no effect on the grid's height!  
This is because the height is unknown. We might have 2 rows totaling 100px or 100,000 rows totaling 1M pixels.  

The grid will not assume the height, assuming 200px and getting 2 rows at 100px? not good.

Usually you would want to stretch the grid in a flex container, or 100% of a parent container.  
In addition, the grid comes with several properties which help managing the layout based on the needs.

These are all covered in the [Concepts -> Grid -> Height And Scrolling](../../../../concepts/grid/height-and-scrolling) section.

## Detecting Scrolling State

When rows are scrolled vertically the *scrolling* state is changes.  

Detecting changes in the scrolling state is supported through one of the following:

### The `(scrolling)` Event Stream

Events emitted when the scrolling state of rows in the grid change.

When scrolling **starts** `1` is emitted if scrolling towards down/end or `-1` if scrolling towards top/start.  
When the scrolling **ends** `0` is emitted.

I> The `(scrolling)` events runes behind a throttling logic that once scrolling has started will wait for at least 2 frames without a scrolling event before emitting end (`0`)

### CSS Class Updates

When scrolling starts the CSS class `pbl-ngrid-scrolling` is added to host element of the grid (`<pbl-ngrid>`) and when scrolling ends the CSS class is removed.

I> Note that the CSS flag is mostly used for plugins, cell template packs, etc.  
It requires disabling of component `encapsulation`, less suitable for application components.

<div pbl-example-view="pbl-scrolling-state-example"></div>

## Horizontal scrolling

Virtual scroll currently support vertical scrolling, horizontal scrolling is not supported at the moment.  
In the future, horizontal scrolling might be added but not as part of the virtual scroll feature.  
