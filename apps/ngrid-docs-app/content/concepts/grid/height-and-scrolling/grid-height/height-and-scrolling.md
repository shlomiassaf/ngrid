---
title: Height And Scrolling
path: concepts/grid/height-and-scrolling
parent: concepts/grid
ordinal: 2
---
# Height And Scrolling

In the layout introduction we covered the different sections of the grid.  
How meta rows (header, footer, etc...) differ by type (fixed, row, sticky) and how they interact with each section and with the data rows.

All of the components in the layout are stacked vertically, one after the other.  
This vertical stack affect and is affected by the height.

In this section we will explain how height affect the vertical stack and how it is affected by the stack itself.  
To simplify things we will only refer to 2 categories in the stack:

- **Data Viewport** - The section containing data rows
- **Metadata Viewport** - All other sections (before and after)

When the grid create the layout, it will first let all of the components in the **Metadata Viewport** occupy the height they need.  
Once done, the remaining height will be occupied by the **Data Viewport**, assuming there is height left to occupy.

In other words, by default, the data viewport has no size and it will grow based on the available space it has left in the container.

The following effects the height and scrolling:

- CSS style of the grid (`<pbl-ngrid>`) (height)
- The layout of meta rows (fixed VS row VS sticky) and size of items in the **Metadata Viewport**
- The value defined in `PblNgridComponent.minDataViewHeight`

The height provided, will effect the **Data Viewport** and if no height is set, it will be set by the layout itself.

All of the above is user defined and different combinations will create different height and scrolling layouts.
We will not cover all possible combination, instead we will explain the effect of each definition.

I> To best visualize the effects we will use a column definition set with multiple meta rows (fixed), i.e meta rows are **outside** of the data viewport

<div pbl-example-view="pbl-grid-height-grid-example" containerClass="mat-elevation-z7"></div>

## minDataViewHeight

When the container height is fixed and there is no height left for the data viewport then it will get no height (0 height).

To simulate this in the example, set the **Explicit Grid Height** to `300` and the **minDataViewHeight** to `None`.  
The items in the **Metadata Viewport** occupy more then 300px, leaving no space for the data rows.

To solve this, we need a way to tell the grid to assign a minimum height to the **Data Viewport**.

We do this by setting the `@Input` property **minDataViewHeight** which accepts a `number` in 2 variations:

A. Default minimum height in explicit pixels  
B. Default minimum height based on an initial amount of rows, multiplied by the row height.

For variation **A**, provide a positive value, for **B** provide a negative value.

For example:

A. Minimum data viewport of 100 pixels: `<pbl-ngrid minDataViewHeight="100"></pbl-ngrid>`  
B. Minimum data viewport of 2 ros: `<pbl-ngrid minDataViewHeight="-2"></pbl-ngrid>`

**Notes when using the row variation**

- The row height is calculated based on an initial row pre-loaded by the grid, this row will get it's height from the CSS theme defined.
- The final amount of rows is the lower value between the row count input and the total rows to render.  
i.e. If the input is 1,000,000 rows and there are only 2, the height occupied will reflect 2 rows.

I> Once height is assigned to the **Data Viewport** the user can view all of the data using the scrollbar.

## Examples

Let's explore some scenarios and understand the result.

### Auto Size of the Data Viewport

When the **minDataViewHeight** is set to `None`, items in the **Data Viewport** will occupy space
**only** if there is any left.

In the example above, setting the **Explicit Grid Height** to `300` is not enough, we need a value which is greater then the total
height of the **Metadata Viewport**. If you set it to `500` or above, you will see data rows.

The **Data Viewport** will grow as much as it is allowed to, when no **minDataViewHeight** is set

### Container Overflow

If we set the **Explicit Grid Height** to `300` and the **minDataViewHeight** to `10 Rows` we end up with a strange layout, containing 2 vertical scroll bars.

This happen because the calculated minimum height of the **Data Viewport** PLUS the total height of the **Metadata Viewport** is greater then the
fixed height we set (300) causing it to overflow and forcing the container to show the scroll bar.

Since there are more rows to render then available height in the **Data Viewport** it also show a scroll bar.

This is something to avoid, the best approach (when possible) is not to limit the size of the grid (or limit with a big enough value) so this won't happen.

## Remember, it is minimum

If we set the **Explicit Grid Height** to `750` and the **minDataViewHeight** to `3 Rows` we end up with more then 3 data rows rendered.

This is because **minDataViewHeight** set's the minimum height, if there is space, it will be occupied.
