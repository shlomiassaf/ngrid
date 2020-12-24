import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicRestClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-bs-async-page-number-example',
  templateUrl: './async-page-number.component.html',
  styleUrls: ['./async-page-number.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-bs-async-page-number-example', { title: 'Async: Page Number' })
export class AsyncPageNumberExample {
  columns = columnFactory()
    .table(
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();

  ds = createDS<Person>()
    .setCustomTriggers('pagination')
    .onTrigger(event => {
      const itemsPerPage = event.pagination.perPage.curr ?? 50 as any;
      const page = event.pagination.page.curr ?? 1;
      return this.client.getPeople({ pagination: { itemsPerPage, page } })
        .then( result => {
          event.updateTotalLength(result.pagination.totalItems);
          return result.items;
        });
    })
    .create();

  constructor(private client: DynamicRestClientApi) { }
}
