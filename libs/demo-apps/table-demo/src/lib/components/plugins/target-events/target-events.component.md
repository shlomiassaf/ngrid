# Target Events

<docsi-mat-example-with-source title="Cell/Row -> Click Events" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table blockUi [dataSource]="ds1" [columns]="columns"
            (cellClick)="onClickEvents($event)"
            (rowClick)="onClickEvents($event)"></sg-table>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Cell/Row -> Enter/Leave Events" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  <sg-table blockUi [dataSource]="ds2" [columns]="columns2" vScrollNone showFooter
            (cellEnter)="onEnterLeaveEvents($event, true)" (cellLeave)="onEnterLeaveEvents($event)"
            (rowEnter)="onEnterLeaveEvents($event, true)" (rowLeave)="onEnterLeaveEvents($event)"></sg-table>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

i> The plugin `@sac/table/detail-row` requires this plugin
