import { from as rxFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { PblTokenPaginator } from '@pebula/ngrid/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

function emulateServerSidePageNumberPaginationCall(datasource: DynamicClientApi, page: number, perPage: number) {
  return rxFrom(datasource.getPeople(500, 5000)).pipe(map( data => {
    const start = (page - 1) * perPage;
    const end = Math.min(data.length, start + perPage);
    return {
      total: data.length,
      data: data.slice(start, end)
    }
  }));
}

function emulateServerSideTokenPaginationCall(datasource: DynamicClientApi, tokenOrPerPage: string | number) {
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
  selector: 'pbl-async-token-example',
  templateUrl: './async-token.component.html',
  styleUrls: ['./async-token.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-async-token-example', { title: 'Async: Token' })
export class AsyncTokenExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>()
    .onTrigger( event => {
      const { pagination } = event;
      let pageChanged: string;
      if (pagination.page.changed) {
        pageChanged = pagination.page.curr;
      }
      if (!pageChanged) {
        this.ds.paginator.reset();
      }
      const { perPage } = this.ds.paginator;
      // emulate HTTP call with server side pagination instructions
      return emulateServerSideTokenPaginationCall(this.datasource, pageChanged || perPage).pipe(
        map( result => {
          if (result.token) {
            const paginator: PblTokenPaginator = <any> this.ds.paginator;
            paginator.addNext(result.token);
          }
          event.updateTotalLength(result.data.length);
          return result.data;
        })
      );
    })
    .setCustomTriggers('pagination')
    .create();

  constructor(private datasource: DynamicClientApi) { }
}
