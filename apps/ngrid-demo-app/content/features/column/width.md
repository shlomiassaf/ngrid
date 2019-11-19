---
title: Column Width
path: features/column/column-width
parent: features/column
ordinal: 1
---
# Column Width

Width is defined in the column definition's **width** property, which accepts an absolute pixel value (`10px`) or relative percent value (`10%`).

In addition, the properties **minWidth** and **maxWidth** can be used to create min/max width boundaries on top of the **width** by providing
a numeric absolute (px) values of can be set (eg: `10`).

I> **width**, **minWidth** and **maxWidth** are *optional*, a column might set all, some or none, allowing powerful column sizing using multiple strategies.

## Width

There are 3 ways to define the **width**:

1. Leaving it blank (auto-assigned by ngrid)
2. **px**, e.g. `50px`
3. **%**, e.g. `20%`

### Width in PX

Setting the width in pixels (e.g.: `100px`) is static, the width is absolute and does not change.

> Note that if you set a **minWidth** that is larger then the **width**, the **minWidth** wins.

### Width in %

Setting the width in percentage (e.g.: `33%`) is dynamic, the width is relative to the width of the container.

In this mode the width boundaries **minWidth** and **maxWidth** can play an important role in the final width of the column

### Automatic width

When a column does not have a specific **width** set **nGrid** will automatically assign a width to it.

**nGrid** will analyze all columns and calculate the width available to all columns without a specific width assigned
and produce a single width value that is evenly spread among all columns without a width assigned.

I> All column without a width will get the same width

In the example below we set the following width's:

| Column Name | id   | name | email            | country | language         | TZ   | balance          | gender           |
|-------------|------|------|------------------|---------|------------------|------|------------------|------------------|
| Definition  | 50px | 25%  | Blank            | 35%     | Blank            | 30px | Blank            | Blank            |

We set the width of **id** and **rate** to absolute values, **name** and **country** to a relative value and 4 other blank columns, without width.
If you resize the browser you will see that **id** and **rate** remain fixed while **name** and **country** and all 4 blank width columns
will expand/shrink accordingly.

<div pbl-example-view="pbl-column-width-example-component"></div>

Let's review the CSS width assigned to each column:

| Column Name | id   | name | email            | country | language         | TZ   | balance          | gender           |
|-------------|------|------|------------------|---------|------------------|------|------------------|------------------|
| Definition  | 50px | 25%  | Blank            | 35%     | Blank            | 30px | Blank            | Blank            |
| Result      | 50px | 25%  | calc(10% - 20px) | 35%     | calc(10% - 20px) | 30px | calc(10% - 20px) | calc(10% - 20px) |

## Minimum / Maximum Width

The minimum width is an absolute value, it is set as a number and represent the absolute minimum width in pixels.
Because a column width can not be lower then the minimum width, setting a minimum width will also effect the minimum width of the table.

For example, if we have 4 columns, each with a minimum width of 300 pixels and our table's width is 1000 pixels we will see a horizontal scroll bar
because the actual table size is 1200 which is 4 columns X 300px.

The maximum width is an absolute value, it is set as a number and represent the absolute maximum width in pixels.
We usually want to set a maximum value when the **width** is set in percentage (e.g. `40%`), this will limit to total width of the column.

When a column reach it's maximum width it behaves like a column with fixed absolute width (i.e. a column with `width` set in pixels)

| Column Name | id   | name | email                 | country | language             | TZ   | balance          | gender           |
|-------------|------|------|-----------------------|---------|----------------------|------|------------------|------------------|
| Definition  | 50px | 25%  | Blank [minWidth: 250] | 35%     | Blank [maxWidth: 50] | 30px | Blank            | Blank            |

<div pbl-example-view="pbl-min-column-width-example-component"></div>
