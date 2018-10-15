# Transpose

W> Transpose DOES NOT support virtual scroll, if your datasource is large performance will suffer.
W> Because transposing is rendering of the datasource vertically, i.e. - each column is a row,
W> and because the table does not support vertical virtual scroll, transpose will not apply virtual scroll.

<div *sgTableCellDef="'name'; value as value;" style="background: green">{{value}}</div>

<docsi-mat-example-with-source title="Transpose" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table blockUi
            [transpose]="transposeToggle"
            [dataSource]="ds1"
            [columns]="columns">
  </sg-table>
  <mat-checkbox [checked]="transposeToggle" (change)="transposeToggle = $event.checked">Transpose Enabled</mat-checkbox>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Transpose with original templates" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@sac-example:ex-2-->
  <sg-table blockUi
            transpose matchTemplates
            [dataSource]="ds2"
            [columns]="columns">
  </sg-table>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Transpose with column styles" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@sac-example:ex-3-->
  <sg-table blockUi
            transpose matchTemplates [transposeDefaultCol]="{ minWidth: 100 }"
            [dataSource]="ds3"
            [columns]="columns">
  </sg-table>
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>
