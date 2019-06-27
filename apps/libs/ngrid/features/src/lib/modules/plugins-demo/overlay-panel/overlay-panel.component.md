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

### Creating overlay panels

To create an overlay panel we use `PblNgridOverlayPanelFactory` which we get through the dependency injection.

```ts
const overlayPanel = overlayPanelFactory.create(this.grid);
```

Now with `overlayPanel` we can create overlay panels.

<docsi-mat-example-with-source title="State Persistence: User session preference" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
 <div fxLayout="row" fxLayoutGap="16px" style="padding: 8px">
    <button fxFlex="noshrink" mat-stroked-button color="accent" (click)="swapNameAndRating()">Swap Name <-> Rating</button>
    <mat-slider thumbLabel tickInterval="1" min="250" max="500"
                [value]="emailWidth" (change)="updateEmailWidth($event.value)">
      <mat-label >Email Width</mat-label>
    </mat-slider>
    <div fxFlex="*"></div>
  </div>
  <!--@pebula-example:ex-1-->
  <pbl-ngrid id="statePersistenceDemo" persistState (afterLoadState)="afterLoadState()"
             blockUi class="pbl-ngrid-cell-ellipsis"
             [dataSource]="ds" [columns]="columns">
  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>


