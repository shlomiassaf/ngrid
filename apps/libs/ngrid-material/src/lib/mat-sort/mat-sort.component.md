# Mat Sort

Column header extension that add the `MatSort` component from material design to the header of sortable columns.

<docsi-mat-example-with-source title="Sorting" contentClass="mat-elevation-z7" [query]="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <pbl-ngrid matSort
             usePagination
             blockUi
             vScrollNone
             fallbackMinHeight="300"
             [dataSource]="simpleSortDS"
             [columns]="columns">
    <pbl-ngrid-paginator *pblNgridPaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></pbl-ngrid-paginator>
  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sorting with default active column and direction" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
  <!--@pebula-example:ex-2-->
  <pbl-ngrid matSort matSortActive="name" matSortDirection="desc"
            blockUi
            [dataSource]="defaultSortDS"
            [columns]="columns">
    <pbl-ngrid-paginator *pblNgridPaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></pbl-ngrid-paginator>
  </pbl-ngrid>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Programmatic Sorting" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-3'}]">
  <!--@pebula-example:ex-3-->
  <pbl-ngrid blockUi matSort [dataSource]="progSortDS" [columns]="columns"></pbl-ngrid>

  <div fxLayout="row" fxLayoutGap="16px" style="padding: 8px">
    <button *ngFor="let key of ['id', 'name', 'gender']"
            fxFlex="noshrink" mat-stroked-button color="primary" (click)="toggleActive(key)">{{ key }} [{{ getNextDirection(key) }}]</button>
    <div fxFlex="*"></div>
    <button mat-stroked-button color="accent" (click)="clear()">Clear</button>
  </div>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>
