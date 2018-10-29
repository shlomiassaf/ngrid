## Sticky Column

<docsi-mat-example-with-source title="Sticky Columns Start using [stickyColumnStart] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-column-1'}]">
    <!--@neg-example:ex-column-1-->
  <neg-table [stickyColumnStart]="['id', 'name']"
            [dataSource]="dataSource"
            [columns]="columns1" style="height: 300px">
  </neg-table>
    <!--@neg-example:ex-column-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Columns End using [stickyColumnEnd] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-column-2'}]">
  <!--@neg-example:ex-column-2-->
  <neg-table [stickyColumnEnd]="['settings.timezone', 'settings.emailFrequency']"
            [dataSource]="dataSource"
            [columns]="columns1" style="height: 300px">
  </neg-table>
    <!--@neg-example:ex-column-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Columns Start and End directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-column-3'}]">
  <!--@neg-example:ex-column-3-->
  <neg-table [stickyColumnStart]="['id', 'name']" [stickyColumnEnd]="['settings.timezone', 'settings.emailFrequency']"
            [dataSource]="dataSource"
            [columns]="columns1" style="height: 300px">
  </neg-table>
  <!--@neg-example:ex-column-3-->
</docsi-mat-example-with-source>
