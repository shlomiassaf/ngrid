import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

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
        prop: 'name',
        span: 1,
        label: 'Un-Locked'
      },
      {
        prop: 'country',
        span: 1,
        label: 'Locked',
        lockColumns: true,
      }
    )
    .headerGroup(
      {
        prop: 'gender',
        span: 2,
        label: 'Gender, Email & Country'
      },
      {
        prop: 'birthdate',
        span: 1,
        label: 'Birthday & Balance',
      }
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
