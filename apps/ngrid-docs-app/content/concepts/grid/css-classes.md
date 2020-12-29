---
title: CSS Classes
path: concepts/grid/css-classes
parent: concepts/grid
ordinal: 3
---
# CSS Classes

## Root CSS Classes

Classes applied on the root element **`<pbl-ngrid>`**

| Class | Description
|-------|------------
| **`.pbl-ngrid-empty`** | Indicate that the grid is empty (no rows)
| **`.pbl-ngrid-scrolling`** | Indicate that grid is being scrolled
| **`.pbl-ngrid-cell-ellipsis`** <br> **`.pbl-ngrid-header-cell-ellipsis`** <br> **`.pbl-ngrid-footer-cell-ellipsis`** | Wrap the respective cell's text and prevent it from breaking to a new line using ellipsis (...).<br>**Apply on the root element**: `<pbl-ngrid class="pbl-ngrid-cell-ellipsis">`

## Row CSS Classes

Classes applied on row elements (the container of cell elements)

There are 2 categories of row elements:

### 1. The Data Row: **`<pbl-ngrid-row>`**

Data row, row containing cells from the dataset.  
Always comes with the class **`.pbl-ngrid-row`**

### 2. Metadata Row: **`<pbl-ngrid-column-row>`** or **`<pbl-ngrid-meta-row>`**

Header or Footer rows, above or below the dataset rows.  
There are 2 types, both share some of the classes applied to metadata rows:

A metadata row will always have one of **`.pbl-ngrid-header-row`** or **`.pbl-ngrid-footer-row`**.

You can also match the (visually) first/last header/footer row:

| Class | Description
|-------|------------
| `.pbl-ngrid-first-header-row` / `.pbl-ngrid-last-header-row` | Indicate that the header row is first / last (taking into account the row's type)
| `.pbl-ngrid-first-footer-row` / `.pbl-ngrid-last-footer-row` | Indicate that the footer row is first / last (taking into account the row's type)

#### **`<pbl-ngrid-column-row>`**

There is only 1 column header row and 1 column footer row.  
Column rows can be toggled (show/hide)  
A column row, if shown is always the closest one to the data rows.

The **header** column row will also have the class **`.pbl-ngrid-header-row-main`** applied to it.

#### **`<pbl-ngrid-meta-row>`**

There can be from 0 to unlimited number of meta rows.

There are 2 sub-types of meta rows:

- Header or Footer meta rows which contain custom cells which are not bound to other cells.
- Group Header meta row/s with cells that are bound to 1 or more column row cells, creating a group.

A group header meta row will have the class **`.pbl-meta-group-row`** applied to it.

I> Currently, there are no group footer rows, they might be added in the future.

## Cell CSS Classes

Classes applied on cell elements.

Similar to rows, the are several types based on the row categories.

### 1. The Data Cell: **`<pbl-ngrid-cell>`**

Data cells are children to data rows (`pbl-ngrid-row`).  
Data cells have the class **`.pbl-ngrid-cell`** applied to them.

Each data cell will also include the expression **pbl-ngrid-column-`COLUMN-ID`** as a class.  
Where `COLUMN-ID` is the **id** property of the column it belongs to.  
For example, for the column **firstName** each data cell (of the **firstName** column) will also have the class **pbl-ngrid-column-`firstName`**

### 2. Metadata Cell: **`<pbl-ngrid-header-cell>`** or **`<pbl-ngrid-meta-cell>`**

Header or Footer cells, children of column rows or meta rows.  
A metadata cell will always have one of **`.pbl-ngrid-header-cell`** or **`.pbl-ngrid-footer-cell`**.

**`<pbl-ngrid-header-cell>`** belongs to the column row.  
**`<pbl-ngrid-meta-cell>`** belongs to the meta row.  

meta row cells that belongs to a group meta row will also have the class **`.pbl-header-group-cell`** applied to it.
