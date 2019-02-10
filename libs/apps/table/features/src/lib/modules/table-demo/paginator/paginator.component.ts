/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
/* @pebula-example:ex-4 */
import { from as rxFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory, NegTokenPaginator } from '@pebula/table';
import { Person, DemoDataSource } from '@pebula/apps/table/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .footer(
    { id: 'PAGINATOR', type: 'PAGINATOR' },
  )
  .build();

function emulateServerSidePageNumberPaginationCall(datasource: DemoDataSource, page: number, perPage: number) {
  return rxFrom(datasource.getPeople(500, 5000)).pipe(map( data => {
    const start = (page - 1) * perPage;
    const end = Math.min(data.length, start + perPage);
    return {
      total: data.length,
      data: data.slice(start, end)
    }
  }));
}

function emulateServerSideTokenPaginationCall(datasource: DemoDataSource, tokenOrPerPage: string | number) {
  const createToken = (page: number, perPage: number) => btoa(JSON.stringify({ page, perPage }));

  if (typeof tokenOrPerPage === 'string') {
    const instructions: { page: number, perPage: number } = JSON.parse(atob(tokenOrPerPage));
    const { page, perPage } = instructions;
    return emulateServerSidePageNumberPaginationCall(datasource, page, perPage).pipe(
      map( result => ({ token: createToken(page + 1, perPage), data: result.data }) )
    );
  } else {
    const token = createToken(2, tokenOrPerPage);
    return emulateServerSidePageNumberPaginationCall(datasource, 1, tokenOrPerPage).pipe(
      map( result => ({ token, data: result.data }) )
    );
  }
}

@Component({
  selector: 'pbl-paginator-table-example-component',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorTableExampleComponent {

  columns = columnFactory().table(...COLUMNS.table.cols).build();
  columnsPaginatorAsFooter = COLUMNS;
  clientSideDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000, 5000) ).create();

  pageNumberDS = createDS<Person>().onTrigger( event => {
    const { page, perPage } = this.pageNumberDS.paginator;
    // emulate HTTP call with server side pagination instructions
    return emulateServerSidePageNumberPaginationCall(this.datasource, page, perPage).pipe(
      map( result => {
        event.updateTotalLength(result.total);
        return result.data;
      })
    );
  })
  .setCustomTriggers('pagination')
  .create();

  tokenDS = createDS<Person>()
    .onTrigger( event => {
      const { pagination } = event;
      let pageChanged: string;
      if (pagination.page.changed) {
        pageChanged = pagination.page.curr;
      }
      if (!pageChanged) {
        this.tokenDS.paginator.reset();
      }
      const { perPage } = this.tokenDS.paginator;
      // emulate HTTP call with server side pagination instructions
      return emulateServerSideTokenPaginationCall(this.datasource, pageChanged || perPage).pipe(
        map( result => {
          if (result.token) {
            const paginator: NegTokenPaginator = <any> this.tokenDS.paginator;
            paginator.addNext(result.token);
          }
          event.updateTotalLength(result.data.length);
          return result.data;
        })
      );
    })
    .setCustomTriggers('pagination')
    .create();

  footerRowDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 20) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @pebula-example:ex-4 */
/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
