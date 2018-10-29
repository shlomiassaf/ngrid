# Sticky Rows

Sticky row's is a core feature from `cdk-table` but comes as a plugin.

## Sticky Row

<docsi-mat-example-with-source title="Sticky Header using [stickyHeader] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-1'}]">
  <!--@neg-example:ex-row-1-->
  <neg-table [stickyHeader]="['table']"
            [dataSource]="dataSource"
            [columns]="columns" style="height: 300px">
  </neg-table>
  <!--@neg-example:ex-row-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Footer using [stickyFooter] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-2'}]">
  <!--@neg-example:ex-row-2-->
  <neg-table [stickyFooter]="['table']" showFooter
            [dataSource]="dataSource"
            [columns]="columns" style="height: 300px">
  </neg-table>
  <!--@neg-example:ex-row-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Header with multi-header row setup" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-3'}]">
  <!--@neg-example:ex-row-3-->
  <neg-table [stickyHeader]="['table', 1]"
            [dataSource]="dataSource"
            [columns]="columnsWithMultiHeaders" style="height: 300px">
  </neg-table>
  <!--@neg-example:ex-row-3-->
</docsi-mat-example-with-source>
