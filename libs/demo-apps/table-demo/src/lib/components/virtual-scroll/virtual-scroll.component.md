# Detail Row

<docsi-mat-example-with-source title="Auto-size Virtual Scroll" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@neg-example:ex-1-->
  <neg-table #tbl1 blockUi [dataSource]="ds1" [columns]="columns" vScrollAuto></neg-table>
  <button mat-button (click)="loadData(tbl1)">Load Data</button>
  <!--@neg-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Fixed-size Virtual Scroll" contentClass="mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@neg-example:ex-2-->
<neg-table #tbl2 blockUi [dataSource]="ds2" [columns]="columns" vScrollFixed="48"></neg-table>
<button mat-button (click)="loadData(tbl2)">Load Data</button>
  <!--@neg-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="No Virtual Scroll" contentClass="mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@neg-example:ex-3-->
  <neg-table #tbl3 blockUi [dataSource]="ds3" [columns]="columns" vScrollNone></neg-table>
  <button mat-button (click)="loadData(tbl3)">Load Data</button>
  <!--@neg-example:ex-3-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Setting default strategy" contentClass="mat-elevation-z7" [query]="[{section: 'ex-4'}]">
  <!--@neg-example:ex-4-->
  <b>Array Size</b>
  <mat-select #select value="500" style="width:200px">
    <mat-option value="100">100</mat-option>
    <mat-option value="500">500</mat-option>
    <mat-option value="1000">1000</mat-option>
    <mat-option value="10000">10000</mat-option>
    <mat-option value="50000">50000</mat-option>
    <mat-option value="100000">100000</mat-option>
  </mat-select>
  <mat-radio-group (change)="setDefaultStrategy($event.value, select.value)" [disabled]="!!ds4">
    <mat-radio-button value="auto">Auto Size</mat-radio-button>
    <mat-radio-button value="fixed">Fixed Size</mat-radio-button>
    <mat-radio-button value="none">No Virtual Scroll</mat-radio-button>
  </mat-radio-group>
  <div class="table-placeholder">
    <neg-table #tbl4 *ngIf="ds4" blockUi [dataSource]="ds4" [columns]="columns"></neg-table>
  </div>
  <button mat-button (click)="ds4 = undefined" [disabled]="!ds4">Reset</button>
  <!--@neg-example:ex-4-->
</docsi-mat-example-with-source>
