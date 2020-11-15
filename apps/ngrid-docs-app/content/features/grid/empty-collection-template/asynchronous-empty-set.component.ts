import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-asynchronous-empty-set-example',
  templateUrl: './asynchronous-empty-set.component.html',
  styleUrls: ['./asynchronous-empty-set.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-asynchronous-empty-set-example', { title: 'Asynchronous Empty Set' })
export class AsynchronousEmptySetExample {
  columns = columnFactory()
    .default({minWidth: 200})
    .table(
      { prop: 'id' },
      { prop: 'name' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000, 0) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
