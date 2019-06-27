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

<docsi-mat-example-with-source title="Excel Style Header Context Menu" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid matHeaderContextMenu="excelMenu" class="pbl-ngrid-cell-ellipsis"
             [dataSource]="ds" [columns]="columns"></pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

### Custom header menus

If the existing style is not sufficient you can provide your own menu by defining an overlay panel template in the registry and providing it's unique name to `matHeaderContextMenu`.

<docsi-mat-example-with-source title="Custom Header Context Menu" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid matHeaderContextMenu="myUniqueHeaderMenuPanel" class="pbl-ngrid-cell-ellipsis"
             [dataSource]="ds" [columns]="columns">
    <div *pblNgridOverlayPanelDef="'myUniqueHeaderMenuPanel'">
      <h1>I Am a panel</h1>
    </div>
  </pbl-ngrid>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

<p>You can read more about the <a [routerLink]="['../..', 'concepts', 'the-registry']">registry</a> and <a [routerLink]="['../..', 'features', 'overlay-panel']">overlay panel</a>.</p>

## Row Context Menu

To be implemented...
