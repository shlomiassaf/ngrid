# Hide Columns

<docsi-mat-example-with-source title="Hide Columns" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table #sgTbl [hideColumns]="hideColumns" [dataSource]="ds1" [columns]="columns" style="height: 300px"></sg-table>
  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px" style="margin: 8px 16px">
    <h3>Hide: </h3>
    <mat-button-toggle-group multiple>
      <mat-button-toggle *ngFor="let c of sgTbl._store.allTable"
                        color="primary"
                        [value]="c" [checked]="hideColumns.indexOf(c.id) > -1"
                        (change)="toggleColumn(c.id)">{{c.label}}</mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Hide Columns" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  2
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Hide Columns" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-3-->
  3
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>
