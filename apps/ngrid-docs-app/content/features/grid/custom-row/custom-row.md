---
title: Custom Row
path: features/grid/custom-row
parent: features/grid
ordinal: 3
---
# Custom Row

In the examples above (row height, row class) we in-directly update the style and layout of the row.  
You can also have a direct impact on the row container using `*pblNgridRowOverride`.

`*pblNgridRowOverride` is A directive for quick replacements of the row container component.

When used inside the content of the grid:

```html
<pbl-ngrid [dataSource]="ds" [columns]="columns">
  <pbl-ngrid-row *pblNgridRowOverride="let row;" row></pbl-ngrid-row>
</pbl-ngrid>
```

However, when used outside of the grid you must provide a reference to the grid so it can register as a template:

```html
<pbl-ngrid-row *pblNgridRowOverride="let row; grid: myGrid" row></pbl-ngrid-row>
<pbl-ngrid #myGrid [dataSource]="ds" [columns]="columns"></pbl-ngrid>
```

<div pbl-example-view="pbl-custom-row-example"></div>

`*pblNgridRowOverride` defines a single row and overrides the default row template the comes with **nGrid**.  
There is no point registering multiple templates in the same grid context, the first will win.

Note that `*pblNgridRowOverride` is a **very simple** wrapper around `*pblNgridRowDef` which is used to register row templates
for single & multi template configurations.

`*pblNgridRowOverride` simply forces it's way to get rendered by setting `when` to `() => true` so it will always "win" over the default row.  
In addition, it provides an interface to register outside of the projected content of the grid.

You can build your own versions of it, representing your logic. In fact, the [Detail Row Plugin](../../built-in-plugins/detail-row) and the [Infinite Scroll Plugin](../infinite-scroll) both extend 
`*pblNgridRowDef` to allow registering custom row templates.
