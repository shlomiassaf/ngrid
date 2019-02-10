# Pagination

The table comes with native support for **logical** pagination in 3 flavors:

- Synchronous (client side)
  - Client Side

- Asynchronous (server side)
  - Page number
  - Tokens

## Logical Pagination

Logical pagination means that the table does not include any concrete UI implementation, this is provided by plugins.
In the following examples we use the `@pebula/table/mat-paginator" which is a  paginator based on the Material Design spec.

In fact, pagination itself is a native datasource feature and the table does not handle any logic, only the datasource.

## Synchronous/Client-Side Pagination

Client side pagination is applied when the entire datasource is available offline or fetched once from the server.

In this scenario the entire process is handled automatically by the table, based on external configuration input.

<docsi-mat-example-with-source title="Client side Paginator" contentClass="table-height-300 mat-elevation-z7" query="[{section: 'ex-1'}]">
  <!--@pebula-example:ex-1-->
  <neg-table usePagination
            blockUi
            vScrollNone
            [dataSource]="clientSideDS"
            [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></neg-table-paginator>
  </neg-table>
  <!--@pebula-example:ex-1-->
</docsi-mat-example-with-source>

Changing the current pages done synchronously because the data exists.

## Asynchronous (server side)

Server side pagination is applied when the datasource is incomplete, only portions of it are fetched each time.
For example, if the entire record-set is 1 million records we might want to fetch 20, 50 or 100 at a time.

In this mode the developer must provide the data when a page has changed, this is because it requires a call to the server.

### Page number

Page number pagination is applied when the server expects metadata that describe the boundaries of the data we want.
For example, the server might expect the total numbers of rows per page and the page we want or the number of rows to
SKIP and the number or rows to TAKE.

Regardless, it is the same information, transforming from one method to the other is simple math.

<docsi-mat-example-with-source title="Page number based Server side Paginator" contentClass="table-height-300 mat-elevation-z7" query="[{section: 'ex-2'}]">
    <!--@pebula-example:ex-2-->
  <neg-table usePagination
            blockUi
            [dataSource]="pageNumberDS"
            [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></neg-table-paginator>
  </neg-table>
  <!--@pebula-example:ex-2-->
</docsi-mat-example-with-source>

### Tokens

Token pagination is applied when the server expects an initial request with metadata the describes the boundaries of the data we want.
From that point, the response is the data set with an additional token that we can use to get the next page.

With this method might be missing the total amount of rows/pages depending on the implementation.

<docsi-mat-example-with-source title="Token based based Server side Paginator" contentClass="table-height-300 mat-elevation-z7" query="[{section: 'ex-3'}]">
    <!--@pebula-example:ex-3-->
  <neg-table usePagination="token"
            blockUi
            [dataSource]="tokenDS"
            [columns]="columns">
    <neg-table-paginator *negTablePaginatorRef="let table"
                        [table]="table"
                        [paginator]="table.ds.paginator"></neg-table-paginator>
  </neg-table>
  <!--@pebula-example:ex-3-->
</docsi-mat-example-with-source>

<docsi-mat-example-with-source title="Paginator using footer row with [stickyFooter]" contentClass="table-height-300 mat-elevation-z7" query="[{section: 'ex-4'}]">
    <p>Using footer row with a [stickyRow] will make the row stick to the bottom only when it is out of the view port.
        This method, however, is a bit more verbose - you must explicitly set the stickyFooter and the column definition for every table.
        If you remove the background of the entire table and leave the background of the internal table you get perfect height alignments.
    </p>
    <p>
      The default behaviour, using a dedicated slot will comes after footer rows and will always stick to the bottom
    </p>
    <!--@pebula-example:ex-4-->
  <neg-table usePagination
            blockUi
            [dataSource]="footerRowDS"
            [columns]="columnsPaginatorAsFooter"
            [stickyFooter]="[0]"
            style="background: transparent">
    <div *negTableFooterCellTypeDef="'PAGINATOR'; table as table"
        style="display: flex; justify-content: flex-end; width: 100%;">
      <neg-table-paginator [table]="table"
                          [paginator]="table.ds.paginator"></neg-table-paginator>
    </div>
  </neg-table>
  <!--@pebula-example:ex-4-->
</docsi-mat-example-with-source>
