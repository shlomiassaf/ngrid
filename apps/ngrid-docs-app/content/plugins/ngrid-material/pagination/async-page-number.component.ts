import { from as rxFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'pbl-async-page-number-example',
  templateUrl: './async-page-number.component.html',
  styleUrls: ['./async-page-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-async-page-number-example', { title: 'Async: Page Number' })
export class AsyncPageNumberExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>().onTrigger( event => {
    const { page, perPage } = this.ds.paginator;
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

  constructor(private datasource: DynamicClientApi) { }
}
