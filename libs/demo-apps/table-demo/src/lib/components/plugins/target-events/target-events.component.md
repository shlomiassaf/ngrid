# Target Events

<docsi-mat-example-with-source title="Cell/Row -> Click Events" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table blockUi [dataSource]="ds1" [columns]="columns"
            (cellClick)="onClickEvents($event)"
            (rowClick)="onClickEvents($event)" style="height: 300px"></neg-table>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Cell/Row -> Enter/Leave Events" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@neg-example:ex-2-->
  <neg-table blockUi [dataSource]="ds2" [columns]="columns2" vScrollNone showFooter
            (cellEnter)="onEnterLeaveEvents($event, true)" (cellLeave)="onEnterLeaveEvents($event)"
            (rowEnter)="onEnterLeaveEvents($event, true)" (rowLeave)="onEnterLeaveEvents($event)" style="height: 300px"></neg-table>
  <!--@neg-example:ex-2-->
</docsi-mat-example-with-source>

i> The plugin `@neg/table/detail-row` requires this plugin
