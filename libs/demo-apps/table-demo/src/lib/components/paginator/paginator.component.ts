/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
/* @sac-example:ex-4 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory, SgTokenPaginator } from '@sac/table';

import { Person, getPersons } from '../../services';

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

function emulateServerSidePageNumberPaginationCall(page: number, perPage: number) {
  return getPersons(500).pipe(map( data => {
    const start = (page - 1) * perPage;
    const end = Math.min(data.length, start + perPage);
    return {
      total: data.length,
      data: data.slice(start, end)
    }
  }));
}

function emulateServerSideTokenPaginationCall(tokenOrPerPage: string | number) {
  const createToken = (page: number, perPage: number) => btoa(JSON.stringify({ page, perPage }));

  if (typeof tokenOrPerPage === 'string') {
    const instructions: { page: number, perPage: number } = JSON.parse(atob(tokenOrPerPage));
    const { page, perPage } = instructions;
    return emulateServerSidePageNumberPaginationCall(page, perPage).pipe(
      map( result => ({ token: createToken(page + 1, perPage), data: result.data }) )
    );
  } else {
    const token = createToken(2, tokenOrPerPage);
    return emulateServerSidePageNumberPaginationCall(1, tokenOrPerPage).pipe(
      map( result => ({ token, data: result.data }) )
    );
  }
}

@Component({
  selector: 'sac-paginator-table-example-component',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorTableExampleComponent {

  columns = COLUMNS.table;
  columnsPaginatorAsFooter = COLUMNS.all;

  clientSideDS = createDS<Person>().onTrigger( () => getPersons(500)) .create();

  pageNumberDS = createDS<Person>().onTrigger( event => {
    const { page, perPage } = this.pageNumberDS.paginator;
    // emulate HTTP call with server side pagination instructions
    return emulateServerSidePageNumberPaginationCall(page, perPage).pipe(
      map( result => {
        event.updateTotalLength(result.total);
        return result.data;
      })
    );
  })
  .setCustomTriggers('pagination')
  .create();

  tokenDS = createDS<Person>().onTrigger( event => {
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
    return emulateServerSideTokenPaginationCall(pageChanged || perPage).pipe(
      map( result => {
        if (result.token) {
          const paginator: SgTokenPaginator = <any> this.tokenDS.paginator;
          paginator.addNext(result.token);
        }
        event.updateTotalLength(result.data.length);
        return result.data;
      })
    );
  })
  .setCustomTriggers('pagination')
  .create();

  footerRowDS = createDS<Person>().onTrigger( () => getPersons(0).pipe(map( data => data.slice(0, 20) )) ) .create();
}
/* @sac-example:ex-4 */
/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
