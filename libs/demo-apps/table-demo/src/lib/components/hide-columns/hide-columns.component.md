# Hide Columns

<docsi-mat-example-with-source title="Hide Columns" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table #sgTbl1 [hideColumns]="hideColumns1" [dataSource]="ds1" [columns]="columns1" style="height: 300px"></sg-table>
  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px" style="margin: 8px 16px">
    <h3>Hide: </h3>
    <mat-button-toggle-group multiple>
      <mat-button-toggle *ngFor="let c of sgTbl1._store.allTable"
                        color="primary"
                        [value]="c" [checked]="hideColumns1.indexOf(c.id) > -1"
                        (change)="toggleColumn(hideColumns1, c.id)">{{c.label}}</mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Hide Columns with Group Headers" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  <sg-table #sgTbl2 [hideColumns]="hideColumns2" [dataSource]="ds2" [columns]="columns2" style="height: 300px"></sg-table>
  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px" style="margin: 8px 16px">
    <h3>Hide: </h3>
    <mat-button-toggle-group multiple>
      <mat-button-toggle *ngFor="let c of sgTbl2._store.allTable"
                        color="primary"
                        [value]="c" [checked]="hideColumns2.indexOf(c.id) > -1"
                        (change)="toggleColumn(hideColumns2, c.id)">{{c.label}}</mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Hide Columns" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-3-->
  3
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>
