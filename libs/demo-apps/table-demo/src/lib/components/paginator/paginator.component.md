# Pagination

<docsi-mat-example-with-source title="Client side Paginator" contentClass="mat-elevation-z7" query="[{section: 'ex-1'}]">
  <!--@sac-example:ex-1-->
  <sg-table usePagination
            blockUi
            [dataSource]="clientSideDS"
            [columns]="columns"
            style="height: 40%"
            class="sg-boxed-table">
    <sg-table-paginator *sgTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></sg-table-paginator>
  </sg-table>
  <!--@sac-example:ex-1-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Page number based Server side Paginator" contentClass="mat-elevation-z7" query="[{section: 'ex-2'}]">
    <!--@sac-example:ex-2-->
  <sg-table usePagination
            blockUi
            [dataSource]="pageNumberDS"
            [columns]="columns"
            style="height: 40%"
            class="sg-boxed-table">
    <sg-table-paginator *sgTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></sg-table-paginator>
  </sg-table>
  <!--@sac-example:ex-2-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Token based based Server side Paginator" contentClass="mat-elevation-z7" query="[{section: 'ex-3'}]">
    <!--@sac-example:ex-3-->
  <sg-table usePagination="token"
            blockUi
            [dataSource]="tokenDS"
            [columns]="columns"
            style="height: 40%"
            class="sg-boxed-table">
    <sg-table-paginator *sgTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.dataSource.paginator"></sg-table-paginator>
  </sg-table>
  <!--@sac-example:ex-3-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Paginator using footer row with [stickyFooter]" contentClass="mat-elevation-z7" query="[{section: 'ex-4'}]">
    <p>Using footer row with a [stickyRow] will make the row stick to the bottom only when it is out of the view port.
        This method, however, is a bit more verbose - you must explicitly set the stickyFooter and the column definition for every table.
        If you remove the background of the entire table and leave the background of the internal table you get perfect height alignments.
    </p>
    <p>
      The default behaviour, using a dedicated slot will comes after footer rows and will always stick to the bottom
    </p>
    <!--@sac-example:ex-4-->
  <sg-table usePagination
            blockUi
            [dataSource]="footerRowDS"
            [columns]="columnsPaginatorAsFooter"
            [stickyFooter]="[0]"
            style="height: 40%; background: transparent"
            class="sg-boxed-table">
    <div *sgTableFooterCellDef="'PAGINATOR'; typeMatch: true; table as table"
        style="display: flex; justify-content: flex-end; width: 100%;">
      <sg-table-paginator [table]="table"
                          [paginator]="table.dataSource.paginator"></sg-table-paginator>
    </div>
  </sg-table>
  <!--@sac-example:ex-4-->
</docsi-mat-example-with-source>
