import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-group-columns-lock-example',
  templateUrl: './group-columns-lock.component.html',
  styleUrls: ['./group-columns-lock.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-group-columns-lock-example', { title: 'Group Columns Lock' })
export class GroupColumnsLockExample {
  columns = columnFactory()
    .default({ reorder: true })
    .table(
      { prop: 'id', wontBudge: true, width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email', width: '150px' },
      { prop: 'country' },
      { prop: 'language' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'balance' },
    )
    .headerGroup(
      {
        label: 'Un-Locked',
        columnIds: ['name', 'gender'],
      },
      {
        label: 'Locked',
        columnIds: ['country', 'language'],
      },
    )
    .headerGroup(
      {
        label: 'Gender, Email & Country',
        columnIds: ['gender', 'email', 'country'],
      },
      {
        label: 'Birthday & Balance',
        columnIds: ['birthdate', 'balance'],
      },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
