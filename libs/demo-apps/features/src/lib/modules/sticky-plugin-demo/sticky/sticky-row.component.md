# Sticky / Pinned Rows

Sticky row's is supported through column definitions and through directives using the `sticky` plugin.

<docsi-mat-example-with-source title="Sticky Row with Column Definition" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-row-1'}]">
  <!--@neg-example:ex-row-1-->
  <neg-table [dataSource]="ds1" [columns]="columnsDef" vScrollAuto wheelMode="blocking"></neg-table>
  <!--@neg-example:ex-row-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Rows with Directives (Sticky Plugin)" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-row-2'}]">
  <!--@neg-example:ex-row-2-->
  <neg-table [stickyHeader]="['table']" [stickyFooter]="['table']" showFooter
             [dataSource]="ds2" [columns]="columns">
  </neg-table>
  <!--@neg-example:ex-row-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Rows - Multi-Header Row Setup" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-3'}]">
  <!--@neg-example:ex-row-3-->
  <neg-table [dataSource]="ds3" showFooter [stickyHeader]="[1]" [stickyFooter]="['table', 1]" [columns]="columnsMulti" style="height: 600px"></neg-table>
  <!--@neg-example:ex-row-3-->
</docsi-mat-example-with-source>
