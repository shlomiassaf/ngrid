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
             [columns]="columns1">
    <pbl-ngrid-paginator *pblNgridPaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></pbl-ngrid-paginator>
  </pbl-ngrid>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Sorting with default active column and direcion" contentClass="table-height-300 mat-elevation-z7" [query]="[{section: 'ex-2'}]">
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
