---
title: Row Height
path: features/grid/row-height
parent: features/grid
ordinal: 1
---
# Row Height

By default the row height is not limited, there is a minimum row height set via CSS (`mix-height`).

i> The minimum limit for a row size can be changed via CSS overrides. The default is 48px

<div pbl-example-view="pbl-row-height-example"></div>

Because it's CSS, the maximum row height might be controlled by CSS (`max-height`), let's try:

<div pbl-example-view="pbl-uncontrolled-row-height-example"></div>

Not what we wanted...

The problem when setting `max-width` is overflow, when the cell's content view height is greater then the maximum width we set.
To solve this the global theme comes with CSS helpers to make sure content does not overflow:

- .pbl-ngrid-cell-ellipsis
- .pbl-ngrid-header-cell-ellipsis
- .pbl-ngrid-footer-cell-ellipsis

When applying one or more of the above, when a relevant cell overflows, the overflow content is hidden and an ellipsis is added.

But now the maximum height has no effect, the height can be controlled only through the `min-height` property.

<div pbl-example-view="pbl-controlled-row-height-example"></div>

W> Using `min-height` to change the table's row height is not recommended, instead apply the overflow helpers and use cell's to determine heights.
This will help avoiding gaps between a cell and it's parent row.
