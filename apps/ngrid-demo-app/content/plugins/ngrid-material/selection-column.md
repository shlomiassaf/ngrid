---
title: Selection Column
path: plugins/ngrid-material/selection-column
parent: plugins/ngrid-material
ordinal: 1
---
# Selection Column

<div pbl-example-view="pbl-selection-column-example"></div>

Bulk mode defines the behavior of bulk select, there are 3 modes:

- **all** - The default mode, bulk select will select the entire data source. This is also the default mode.
- **view** - Bulk select will select only the rendered items, this mode requires virtual scroll enabled in auto or fixed mode. When no virtual scroll it behaves like `all`.
- **none** - No bulk mode option, the bulk mode checkbox will not show.

<div pbl-example-view="pbl-bulk-mode-and-virtual-scroll-example"></div>
