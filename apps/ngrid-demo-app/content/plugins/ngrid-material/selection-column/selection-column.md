---
title: Selection Column
path: plugins/ngrid-material/selection-column
parent: plugins/ngrid-material
ordinal: 1
---
# Selection Column

The selection column plugin adds a selection checkbox column using the `mat-checkbox` component.

To apply the plugin, simply apply the directive `matCheckboxSelection` following the name of the column that should be used for selection.

For example:

```html
<pbl-ngrid matCheckboxSelection="selection" [dataSource]="ds" [columns]="columns"></pbl-ngrid>
```

The column `selection` will now render `mat-checkbox` and automatically connect to the selection collection of the `PblDataSource`.

<div pbl-example-view="pbl-selection-column-example"></div>

## Bulk Mode

Bulk mode defines the behavior of bulk select, there are 3 modes:

- **all** - The default mode, bulk select will select the entire data source. This is also the default mode.
- **view** - Bulk select will select only the rendered items, this mode requires virtual scroll enabled in auto or fixed mode. When no virtual scroll it behaves like `all`.
- **none** - No bulk mode option, the bulk mode checkbox will not show.

<div pbl-example-view="pbl-bulk-mode-and-virtual-scroll-example"></div>

## CheckBox Color

The material checkbox component allow selecting the `ThemePalette` to use through the color input.

To pass-through the `ThemePalette` use the `matCheckboxSelectionColor` input:

```html
<pbl-ngrid matCheckboxSelection="selection" matCheckboxSelectionColor="warn"></pbl-ngrid>
```

I> The default palette is the same default palette used by `mat-checkbox` (accent)

<div pbl-example-view="pbl-checkbox-color-example"></div>
