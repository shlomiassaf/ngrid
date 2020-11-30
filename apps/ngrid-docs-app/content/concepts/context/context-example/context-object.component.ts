import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-context-object-example',
  templateUrl: './context-object.component.html',
  styleUrls: ['./context-object.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-context-object-example', { title: 'Context Object' })
export class ContextObjectExample {
  columns = columnFactory()
    .table(
      { prop: 'id', width: '50px' },
      { prop: 'name', width: '100px', pIndex: true },
      { prop: 'firstRender', width: '50px' },
      { prop: 'outOfView', width: '50px' },
      { prop: 'dsIndex', width: '50px' },
      { prop: 'index', width: '50px' },
      { prop: 'count', width: '50px' },
      { prop: 'odd', width: '50px' },
      { prop: 'even', width: '50px' },
      { prop: 'first', width: '50px' },
      { prop: 'last', width: '50px' },
      { prop: 'identity', width: '100px' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
