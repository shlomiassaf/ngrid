---
title: Quick-through
path: concepts/columns/quick-through
parent: concepts/columns
ordinal: 0
---
# Column Quickthrough

The most simple definition for a column is a vertical series of cells.

<div pbl-app-content-chunk="pbl-columns-app-content-chunk" inputs='{ "section": 1 }'></div>

There are 2 roles: **Data Column**{style="color:green"} and **Meta Column**{style="color:deepskyblue"}

## Data Columns (`PblColumn`)
{style="color:green"}

- All **green cells**{style="color:green"} belong to the column `name`.
- They all share the column definitions (e.g. `width`).
- They differ based on the column **sub-role**

There are 3 **sub-roles**, here in visual order of appearance:

- 1 **header** cell
- N **data** cells (in this example, N === 2)
- 1 **footer** cell

The split is fixed, it will always be 1/N/1.

Each **sub-role** will have its unique

- Rendering template (more on this later...)
- **Role** CSS class name (`pbl-ngrid-header-cell`, `pbl-ngrid-cell`, `pbl-ngrid-footer-cell`)
- Column data type (optional)

> The CSS classes shared by all **sub-roles**:
>
> - CSS set in the column definitions definitions (`css`) 
> - **Identity** CSS (pbl-ngrid-column-**[Identity]**)

They all share a logical connection, they work as one unit:

- If we hide the column all 3 are gone.
- If we change the width all 3 will change.
- If we move column all 3 will move together.

I> A data column is the only column that span over a **vertical** series of cells.

## Meta Columns (`PblMetaColumn`)
{style="color:deepskyblue"}

- All **skyblue cells**{style="color:deepskyblue"} are meta columns
- Except the role they share nothing.
- The border color indicates their **sub-role**: **`Meta Header`**{style="color:red"}, **`Meta Header Group`**{style="color:purple"} and **`Meta Footer`**{style="color:yellow"}

Each **sub-role** is hosted in a meta row of the same type, having columns from the same **sub-role**.

I> The **`Meta Header Group`**{style="color:purple"} has it's own class `PblColumnGroup`, extending `PblMetaColumn`

I> Currently, Footer groups are not supported, this will be added in the future.
