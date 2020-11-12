---
title: Row and Cell Layout
path: concepts/grid/row-layout
parent: concepts/grid
ordinal: 1
---
# Row and Cell Layout

The **Row and Cell Layout** refer to the structure of data rows and row child elements, regarding DOM structure, CSS and styling.

## Basic Row Element

The grid's row element:

```html
<pbl-ngrid-row class="pbl-ngrid-row">
    <!-- Cell Elements Here -->
</pbl-ngrid-row>
```

2 key points:

- All data rows are `pbl-ngrid-row`
- All data rows have the CSS class `pbl-ngrid-row`

In addition, [you can apply your own CSS classes](../../../features/grid/row-class), on a per-row basis.

## Basic Cell Element

The grid's cell element:

```html
<pbl-ngrid-cell class="pbl-ngrid-cell">
    <!-- The data template for the cell, rendered here -->
</pbl-ngrid-cell>
```

2 key points:

- All data cells are `pbl-ngrid-cell`
- All data cells have the CSS class `pbl-ngrid-cell`

Additional css classes are added to `pbl-ngrid-cell` based on the column the cell belongs to:

- All data cells have the css `pbl-ngrid-column-` with a suffix based on the **id** of the column.  
  For example, the column `name` will add the css class `pbl-ngrid-column-name` to all of it's data cells.

- All data cells have the css `pbl-ngrid-column-type-` with a suffix based on the **type** of the column (when **type** is defined).  
  For example, a column with the type `number` will add the css class `pbl-ngrid-column-type-number` to all of it's data cells.

In addition, [you can apply your own CSS classes](../../columns/column-model#column-definition), on a per-column basis.
