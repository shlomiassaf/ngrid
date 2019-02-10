# Hide Columns

<docsi-mat-example-with-source title="Hide Columns" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-table #pblTbl1 [hideColumns]="hideColumns1" [dataSource]="ds1" [columns]="columns1"></pbl-table>
  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px" style="margin: 8px 16px">
    <h3>Hide: </h3>
    <mat-button-toggle-group multiple>
      <mat-button-toggle *ngFor="let c of pblTbl1.columnApi.columns"
                        color="primary"
                        [value]="c" [checked]="hideColumns1.indexOf(c.id) > -1"
                        (change)="toggleColumn(hideColumns1, c.id)">{{c.label}}</mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Hide Columns with Group Headers" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-table #pblTbl2 [hideColumns]="hideColumns2" [dataSource]="ds2" [columns]="columns2"></pbl-table>
  <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="16px" style="margin: 8px 16px">
    <h3>Hide: </h3>
    <mat-button-toggle-group multiple>
      <mat-button-toggle *ngFor="let c of pblTbl2.columnApi.columns"
                        color="primary"
                        [value]="c" [checked]="hideColumns2.indexOf(c.id) > -1"
                        (change)="toggleColumn(hideColumns2, c.id)">{{c.label}}</mat-button-toggle>
    </mat-button-toggle-group>
  </div>

  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Hide Columns" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-3-->
  3
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>
