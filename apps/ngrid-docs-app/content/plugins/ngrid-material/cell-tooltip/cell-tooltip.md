---
title: Cell Tooltip
path: plugins/ngrid-material/cell-tooltip
parent: plugins/ngrid-material
ordinal: 1
---
# Cell Tooltip

The **Cell Tooltip** plugins provides a wrapper around the `MatTooltip` directive and allow a tooltip at the cell level without
setting a `MatTooltip` instance for every cell.

## Default Behavior

The default behavior is to show a tooltip when the content of the cell overflows.

<div pbl-example-view="pbl-cell-tooltip-example"></div>

This is done using a simple check that might not fit all scenarios.

## Massy Setup

The **`cellTooltip`** directive can also be defined as a content element (to the table).
This is handy when you have a custom setup with a lot of options.

<div pbl-example-view="pbl-custom-setup-example"></div>
