import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-bs-sort-header-example',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-bs-sort-header-example', { title: 'Sort Header' })
export class SortHeaderExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', sort: true, width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
