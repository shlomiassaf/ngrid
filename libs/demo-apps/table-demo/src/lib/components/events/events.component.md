# Detail Row

<docsi-mat-example-with-source title="Detail Row" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table [dataSource]="ds1" [columns]="columns" footerRow
            (cellClick)="onCellClick($event)"></sg-table>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row custom parent" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  2
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row Single mode & exclude toggle mode" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@sac-example:ex-3-->
  3
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Detail Row predicate" contentClass="mat-elevation-z7" [query]="[{section: 'ex-4'}]">
  <!--@sac-example:ex-4-->
  4
  <!--@sac-example:ex-4-->
</docsi-mat-example-with-source>
