# Column Width

Column width is set though column definition in `NegColumn`.

We set the width in the **width** property, which accepts a string value representing the width in pixels or percentage. (e.g. "100px" or "50%")

In addition, there are 2 properties we can use to define the width boundaries:

- **minWidth** (number): The absolute minimum width in pixels (e.g. 100)
- **maxWidth** (number): The absolute maximum width in pixels (e.g. 200)

We can use these boundaries when **width** is represented in percentage or not set at all.

I> **width**, **minWidth** and **maxWidth** are *optional*, a column might set all, some or none, allowing powerful column sizing using multiple strategies.

## Width

Width is the main property we use to define the column width. We can set it in absolute pixel values or in relative percentage or leave it
empty and let the table calculate the width.

### Width in PX

Setting the width in pixels (e.g.: `100px`) is static, the width is absolute and does not change.

In this mode the width boundaries **minWidth** and **maxWidth** have no effect.

### Width in %

Setting the width in percentage (e.g.: `33%`) is dynamic, the width is relative to the width of the container.

In this mode the width boundaries **minWidth** and **maxWidth** can play an important role in the final width of the column

### Automatic width

When a column does not have a specific **width** set the table will assign a width to it.

The width is calculated based on the width setting of other columns and it is identical for all
column without a **width** set.

W> All column without a width will get the same width

When calculating the width, the table take into account all of the columns with width set (absolute or relative) and produces
a total width for all column without a width. The total width is then split evenly between all column without a width.

In the example below we set the following width's:

- name: 100px
- gender: 50px
- birthdate: 25%
- bio: *WIDTH NOT SET*

We set the width of **name** and **gender** to absolute values, **birthdate** to a relative value and **bio** without a value.
If you resize the browser you will see that **name** and **gender** remain fixed while **birthdate** and **bio**  will expand/shrink accordingly.

Note that the width for **bio** is not set, the table will assign a width to it.

<docsi-mat-example-with-source title="Column Width" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-1-->
  <neg-table [dataSource]="ds1" [columns]="columns1"></neg-table>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

Let's review the CSS width assigned to each column:

| Column Name       |       |                   |
|-------------------|-------|-------------------|
| name              | 100px | 100px             |
| gender            | 50px  | 50px              |
| birthdate         | 25%   | 25%               |
| bio               | --    | calc(75% - 150px) |

For **name**, **gender** and **birthdate** the output is straight forward.
**bio** is what the table calculate, in this setup it is rather simple, 75% minus 150px.
75% because we remove 25% due to **birtdate** and 150px because of **name** (100) and **gender** (50)

## Minimum Width

The minimum width is an absolute value, it is set as a number and represent the absolute minimum width in pixels.
Because a column width can not be lower then the minimum width, setting a minimum width will also effect the minimum width of the table.

For example, if we have 4 columns, each with a minimum width of 300 pixels and our table's width is 1000 pixels we will see a horizontal scroll bar
because the actual table size is 1200 which is 4 columns X 300px.

<docsi-mat-example-with-source title="Minimum Column Width" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-2-->
  <neg-table [dataSource]="ds2" [columns]="columns2"></neg-table>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

## Maximum Width

The maximum width is an absolute value, it is set as a number and represent the absolute maximum width in pixels.
We usually want to set a maximum value when the **width** is set in percentage (e.g. `40%`), this will limit to total width of the column.

When a column reach it's maximum width it behaves like a column with fixed absolute width (i.e. a column with `width` set in pixels)

In the example below, notice how we set a maximum width to **gender** (50) and **birtdate** (100).
We did not set any width related option in the remaining columns so they will split the remaining space evenly.

<docsi-mat-example-with-source title="Maximum Column Width" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-3-->
  <neg-table [dataSource]="ds3" [columns]="columns3"></neg-table>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>
