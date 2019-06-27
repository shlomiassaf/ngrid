# Transpose

W> Transpose DOES NOT support virtual scroll, if your datasource is large performance will suffer.
W> Because transposing is rendering of the datasource vertically, i.e. - each column is a row,
W> and because the table does not support vertical virtual scroll, transpose will not apply virtual scroll.

<div *pblNgridCellDef="'name'; value as value;" style="background: green">{{value}}</div>

<docsi-mat-example-with-source title="Transpose" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid blockUi
             [transpose]="transposeToggle"
             [dataSource]="ds1"
             [columns]="columns">
    <div *pblNgridCellTypeDef="'date'; value as value; col as col; row as row">{{value | date:col.type.data.format}}</div>
  </pbl-ngrid>
  <mat-checkbox [checked]="transposeToggle" (change)="transposeToggle = $event.checked">Transpose Enabled</mat-checkbox>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Transpose with original templates" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid blockUi
            transpose matchTemplates
            [dataSource]="ds2"
            [columns]="columns">
  </pbl-ngrid>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Transpose with column styles" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@pebula-example:ex-3-->
  <pbl-ngrid blockUi
            transpose matchTemplates [transposeDefaultCol]="{ minWidth: 100 }"
            [dataSource]="ds3"
            [columns]="columns">
  </pbl-ngrid>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>
