# Sticky / Pinned Rows

Sticky row's is supported through column definitions and through directives using the `sticky` plugin.

<docsi-mat-example-with-source title="Sticky Row with Column Definition" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-row-1'}]">
  <!--@pebula-example:ex-row-1-->
  <pbl-ngrid [dataSource]="ds1" [columns]="columnsDef" vScrollAuto wheelMode="blocking"></pbl-ngrid>
  <!--@pebula-example:ex-row-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Rows with Directives (Sticky Plugin)" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-row-2'}]">
  <!--@pebula-example:ex-row-2-->
  <pbl-ngrid [stickyHeader]="['table']" [stickyFooter]="['table']" showFooter
             [dataSource]="ds2" [columns]="columns">
  </pbl-ngrid>
  <!--@pebula-example:ex-row-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Rows - Multi-Header Row Setup" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-3'}]">
  <!--@pebula-example:ex-row-3-->
  <pbl-ngrid [dataSource]="ds3" showFooter [stickyHeader]="[1]" [stickyFooter]="['table', 1]" [columns]="columnsMulti" style="height: 600px"></pbl-ngrid>
  <!--@pebula-example:ex-row-3-->
</docsi-mat-example-with-source>
