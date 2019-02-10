# Selection Column

<docsi-mat-example-with-source title="Selection Column" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid matCheckboxSelection="selection" [dataSource]="ds1" [columns]="columns1"></pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

Bulk mode defines the behavior of bulk select, there are 3 modes:

- **all** - The default mode, bulk select will select the entire data source. This is also the default mode.
- **view** - Bulk select will select only the rendered items, this mode requires virtual scroll enabled in auto or fixed mode. When no virtual scroll it behaves like `all`.
- **none** - No bulk mode option, the bulk mode checkbox will not show.

<docsi-mat-example-with-source title="Bulk Mode & Virtual Scroll" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid matCheckboxSelection="selection" [bulkSelectMode]="bulkSelectMode"
            class="pbl-ngrid-cell-ellipsis" showFooter [stickyHeader]="['table']" [stickyFooter]="['table']" [dataSource]="ds2" [columns]="columns2"></pbl-ngrid>
  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px" style="margin: 8px 16px">
    <h3>Bulk Mode: </h3>
    <mat-button-toggle-group>
      <mat-button-toggle value="all" [checked]="bulkSelectMode === 'all'" (change)="bulkSelectMode = 'all'">All</mat-button-toggle>
      <mat-button-toggle value="view" [checked]="bulkSelectMode === 'view'" (change)="bulkSelectMode = 'view'">View</mat-button-toggle>
      <mat-button-toggle value="none" [checked]="bulkSelectMode === 'none'" (change)="bulkSelectMode = 'none'">None</mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>
