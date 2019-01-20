# Sticky Column

## Using Column Definitions

<docsi-mat-example-with-source title="Sticky Columns" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-column-1'}]">
  <!--@neg-example:ex-column-1-->
  <neg-table [dataSource]="ds1" [columns]="columnsDef"></neg-table>
  <!--@neg-example:ex-column-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Columns Sticky Plugin" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-column-2'}]">
    <!--@neg-example:ex-column-2-->
  <neg-table [stickyColumnStart]="['name']" [stickyColumnEnd]="['settings.timezone', 'settings.emailFrequency']"
            [dataSource]="ds2"
            [columns]="columnsPlugin">
  </neg-table>
  <!--@neg-example:ex-column-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Columns Mix (definitions & plugin)" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-column-3'}]">
  <!--@neg-example:ex-column-3-->
  <neg-table [stickyColumnStart]="['name']" [stickyColumnEnd]="['settings.timezone']"
            [dataSource]="ds3"
            [columns]="columnsMix">
  </neg-table>
  <!--@neg-example:ex-column-3-->
</docsi-mat-example-with-source>
