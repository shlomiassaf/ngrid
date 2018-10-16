## Sticky Column

<docsi-mat-example-with-source title="Sticky Columns Start using [stickyColumnStart] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-column-1'}]">
    <!--@sac-example:ex-column-1-->
  <sg-table [stickyColumnStart]="['id', 'name']"
            [dataSource]="dataSource"
            [columns]="columns1">
  </sg-table>
    <!--@sac-example:ex-column-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Columns End using [stickyColumnEnd] directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-column-2'}]">
  <!--@sac-example:ex-column-2-->
  <sg-table [stickyColumnEnd]="['settings.timezone', 'settings.emailFrequency']"
            [dataSource]="dataSource"
            [columns]="columns1">
  </sg-table>
    <!--@sac-example:ex-column-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sticky Columns Start and End directive" contentClass="mat-elevation-z7" [query]="[{section: 'ex-column-3'}]">
  <!--@sac-example:ex-column-3-->
  <sg-table [stickyColumnStart]="['id', 'name']" [stickyColumnEnd]="['settings.timezone', 'settings.emailFrequency']"
            [dataSource]="dataSource"
            [columns]="columns1">
  </sg-table>
  <!--@sac-example:ex-column-3-->
</docsi-mat-example-with-source>
