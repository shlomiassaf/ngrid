---
title: Selection Column
path: plugins/ngrid-bootstrap/selection-column
parent: plugins/ngrid-bootstrap
ordinal: 20
---
# Selection Column

The selection column plugin adds a selection checkbox column using the `mat-checkbox` component.

To apply the plugin, simply apply the directive `matCheckboxSelection` following the name of the column that should be used for selection.

For example:

```html
<pbl-ngrid bsSelectionColumn="selection" [dataSource]="ds" [columns]="columns"></pbl-ngrid>
```

The column `selection` will now render `mat-checkbox` and automatically connect to the selection collection of the `PblDataSource`.

<div pbl-example-view="pbl-bs-selection-column-example" containerClass="pbl-docs-bootstrap"></div>

## Bulk Mode

Bulk mode defines the behavior of bulk select, there are 3 modes:

- **all** - The default mode, bulk select will select the entire data source. This is also the default mode.
- **view** - Bulk select will select only the rendered items, this mode requires virtual scroll enabled in auto or fixed mode. When no virtual scroll it behaves like `all`.
- **none** - No bulk mode option, the bulk mode checkbox will not show.

<div pbl-example-view="pbl-bs-bulk-mode-and-virtual-scroll-example" containerClass="pbl-docs-bootstrap"></div>
