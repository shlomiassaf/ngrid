# Sticky Rows

Sticky row's is a core feature from `cdk-table` but comes as a plugin.

## Sticky Row

<docsi-mat-example-with-source title="Sticky Header using [stickyHeader] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-1'}]">
  <!--@sac-example:ex-row-1-->
  <sg-table [stickyHeader]="['table']"
            [dataSource]="dataSource"
            [columns]="columns">
  </sg-table>
  <!--@sac-example:ex-row-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Footer using [stickyFooter] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-2'}]">
  <!--@sac-example:ex-row-2-->
  <sg-table [stickyFooter]="['table']" footerRow
            [dataSource]="dataSource"
            [columns]="columns">
  </sg-table>
  <!--@sac-example:ex-row-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Header with multi-header row setup" contentClass="mat-elevation-z7" [query]="[{section: 'ex-row-3'}]">
  <!--@sac-example:ex-row-3-->
  <sg-table [stickyHeader]="['table', 1]"
            [dataSource]="dataSource"
            [columns]="columnsWithMultiHeaders">
  </sg-table>
  <!--@sac-example:ex-row-3-->
</docsi-mat-example-with-source>
