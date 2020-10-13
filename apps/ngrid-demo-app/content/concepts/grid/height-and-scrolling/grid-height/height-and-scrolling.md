---
title: Height And Scrolling
path: concepts/grid/height-and-scrolling
parent: concepts/grid
ordinal: 2
---
# Height And Scrolling

In the layout introduction we covered the different sections of the table, how meta rows (header, footer, etc...) differ by type (fixed, row, sticky)
and how they interact with each section and with the data rows.

Height and scrolling refer to:

- Total grid height (the height of `<pbl-ngrid>`)
- The height of the data rows section
- The data rows section scroll bar
- The grid's scrollbar (`<pbl-ngrid>`)

The following effects the height and scrolling:

- CSS style of the grid (`<pbl-ngrid>`) (height)
- Virtual scroll mode
- The layout of meta rows (fixed VS row VS sticky)
- `PblNgridComponent.fallbackMinHeight`

All of the above is user defined and different combinations create different height and scrolling layouts.
We will not cover all possible combination, instead we will explain the effect of each definition.

I> To best visualize the effects we will use a column definition set with multiple meta rows (fixed)

<div pbl-example-view="pbl-grid-height-grid-example"></div>

## fallbackMinHeight

The `fallbackMinHeight` input defines the absolute minimum height (in pixels) to assign to the data row section container (not the grid).

When not set, no minimum height is defined to the data row section container which can lead to different outcomes depending on the virtual scroll mode.

### fallbackMinHeight with virtual scroll

When **virtual scroll** is enabled the data row section's height is based on the grid's height.  
This means that if there is not explicit height set to the grid the data row's section will have a height of 0.

To work around that you can either:

- Set a height to the grid (%, px, flex or any other method).
- Set the **fallbackMinHeight** input property of the grid

In the example above you can see that setting the grid's height is not enough (**Explicit grid height**) and you also need to check **Set fallbackMinHeight to 150**.
This happen because the explicit grid height set is **300px** but we have a lot of meta rows which take more then 300px, so data rows get no height.

If the total height of all meta rows would have been 100px the data rows section would have been 200px.

If virtual scroll is enabled and **Set fallbackMinHeight to 150** is set to true the total height of the grid will be 150px (data rows) plus the total height of all meta rows.

### fallbackMinHeight without virtual scroll

When **virtual scroll** is disabled the data row section will take all the space it needs to render all rows.

If the grid has an explicit height set the grid will show a single scroll bar that will scroll all rows, including meta rows of type fixed.

However, when **virtual scroll** is disabled and **fallbackMinHeight** is set, the behavior of **fallbackMinHeight** is a bit different.
In such case, the data row section is limited to the height set in **fallbackMinHeight**.

#### Multiple scroll bars

Multiple bar scroll bars are something you should avoid.

To reproduce them in the example above:

- Disable virtual scroll
- Enable explicit grid height & fallbackMinHeight

The reason for having 2 scroll bars is the fact that we have a grid height limit of 300px that contains a data row section of 150px plus multiple meta rows that
take more then the remaining 150px.

The result is a scroll bar for the entire gris and a scroll bar for the data rows section.
