# Grid Filler

The table's background is transparent, when the total height of the rows is lower then the height available this is visible.

The filler is a `<div>` that is added at the bottom of the grid and takes up
the height left.

You can customize it's background through the CSS class `pbl-ngrid-space-fill`

I> You can also solve this by assigning a background color to the table but this is not always suitable.

In the following example the table is rendered inside a div container that has a `lightgreen` background color.

<docsi-mat-example-with-source title="Filler" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <div class="filler-table-container">
    <pbl-ngrid blockUi vScrollAuto [dataSource]="dsVScrollAuto" [columns]="columns">
      <pbl-demo-action-row filter ></pbl-demo-action-row>
    </pbl-ngrid>
  </div>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

#### The same thing, now with fixed mode virtual scroll:

<div class="filler-table-container">
  <pbl-ngrid blockUi vScrollFixed [dataSource]="dsVScrollFixed" [columns]="columns">
    <pbl-demo-action-row filter " ></pbl-demo-action-row>
  </pbl-ngrid>
</div>

W> Currently, the filler is not supported when virtual scroll is disabled (`vScrollNone`)

<div class="filler-table-container">
  <pbl-ngrid blockUi vScrollNone [dataSource]="dsVScrollNone" [columns]="columns">
    <pbl-demo-action-row filter " ></pbl-demo-action-row>
  </pbl-ngrid>
</div>
