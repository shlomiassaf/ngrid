# Overlay Panel

The overlay panel plugin provides a way to open floating panels on top of the grid elements, relative to a source (usually a cell).

I> The overlay panel plugin is based on the <a href="https://material.angular.io/cdk/overlay/overview" target="_blank">overlay module</a> (`@angular/cdk/overlay`).

## Usage

To use the overlay plugin first import it into your application module:

```ts
import { PblNgridOverlayPanelModule } from '@pebula/ngrid/overlay-panel';

@NgModule({
  imports: [
    /* .. */
    PblNgridOverlayPanelModule
  ],
  /* .. */
})
export class MyAppModule { }
```

## Defining panels

A panel is the element that should be displayed by the plugin.

Each panel definition must be assigned with a unique name so it can be referenced later when it should be displayed.

There are 2 ways to define a panel

- Using a template
- Using a component extension

A template panel definition looks like this:

```html
<div *pblNgridOverlayPanelDef="'myUniquePanelName'">
  <h1>I Am a panel</h1>
</div>
```

We used **myUniquePanelName** as the unique name to identify the template later when we want to use it.

<p>Panels are stored in the <a [routerLink]="['../..', 'concepts', 'the-registry']">registry</a> and so they are bound to the registry lifetime rules.</p>

> Component extensions are more complex and out of the scope of this tutorial.

I> To see how component extensions are used, or for an advanced example, visit the source code for the plugin `@pebula/ngrid-material/context-menu`

## Creating overlay panels

To create an overlay panel we use `PblNgridOverlayPanelFactory` which we get through the dependency injection.

```ts
const overlayPanel = overlayPanelFactory.create(this.grid);
```

Now with `overlayPanel` we can create overlay panels.

<docsi-mat-example-with-source title="Overlay Panel with templates" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
 <div fxLayout="row" fxLayoutGap="16px" style="padding: 8px">
    <button fxFlex="noshrink" mat-stroked-button color="accent" (click)="show()">Show Panel</button>
    <div fxFlex="*"></div>
  </div>
  <!--@pebula-example:ex-1-->
  <pbl-ngrid class="pbl-ngrid-cell-ellipsis" [dataSource]="ds" [columns]="columns">
    <div *pblNgridOverlayPanelDef="'myUniquePanelName'">
      <h1>I Am a panel</h1>
    </div>
  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

