# Cell Tooltip

The **Cell Tooltip** plugins provides a wrapper around the `MatTooltip` directive and allow a tooltip at the cell level without
setting a `MatTooltip` instance for every cell.

## Default Behavior

The default behavior is to show a tooltip when the content of the cell overflows.

<docsi-mat-example-with-source title="Cell ToolTip (DEFAULT)" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <neg-table cellTooltip class="neg-table-cell-ellipsis"
            blockUi [dataSource]="ds1" [columns]="columns"></neg-table>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

This is done using a simple check that might not fit all scenarios.

## Massy Setup

The **`cellTooltip`** directive can also be defined as a content element (to the table).
This is handy when you have a custom setup with a lot of options.

<docsi-mat-example-with-source title="Cell/Row -> Enter/Leave Events" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <neg-table class="neg-table-cell-ellipsis" blockUi [dataSource]="ds2" [columns]="columns">
    <ng-container cellTooltip
                  [message]="getTooltipMessage"
                  tooltipClass="my-cell-tooltip"
                  position="above"
                  showDelay="500"
                  showHide="250"></ng-container>
  </neg-table>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>
