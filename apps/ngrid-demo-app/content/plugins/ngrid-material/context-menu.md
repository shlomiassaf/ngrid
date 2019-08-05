---
title: Context Menu
path: plugins/ngrid-material/context-menu
parent: plugins/ngrid-material
ordinal: 8
---
# Context Menu

A collection of context menu's built using material components.

## Setup

```ts
import { PblNgridContextMenuModule } from '@pebula/ngrid-material/context-menu';

@NgModule({
  imports: [
    /* .. */
    PblNgridContextMenuModule
  ],
  /* .. */
})
export class MyAppModule { }
```

I> `PblNgridContextMenuModule` internally imports `@pebula/ngrid/overlay-panel` and additional modules from `@angular/material`.

## Header Context Menu

The header context menu has 2 sections

- The trigger applied in the header cell
- The menu overlay

The menu can be configured so multiple menu styles can be used.

I> Note that currently only 1 built-in style is provided (excel menu style) but you can also use your
own custom menu styles.

To apply the header context menu on a grid:

```html
<pbl-ngrid matHeaderContextMenu="excelMenu"></pbl-ngrid>
```

Where `excelMenu` is the style you want to use.

### Excel Style Menu

The header context menu is designed based on the excel header menu and is using the `MatMenu` component from `@angular/material/menu`.

To use is, simple provide **excelMenu** to `matHeaderContextMenu`

<div pbl-example-view="pbl-context-menu-example"></div>

### Custom header menus

If the existing style is not sufficient you can provide your own menu by defining an overlay panel template in the registry and providing it's unique name to `matHeaderContextMenu`.

<div pbl-example-view="pbl-custom-header-example"></div>

<p>You can read more about the <a [routerLink]="['../..', 'concepts', 'the-registry']">registry</a> and <a [routerLink]="['../..', 'features', 'overlay-panel']">overlay panel</a>.</p>

## Row Context Menu

To be implemented...
