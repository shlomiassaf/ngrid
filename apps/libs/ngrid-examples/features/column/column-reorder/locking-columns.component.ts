import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-locking-columns-example',
  templateUrl: './locking-columns.component.html',
  styleUrls: ['./locking-columns.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-locking-columns-example', { title: 'Locking Columns' })
export class LockingColumnsExample {
  columns = columnFactory()
    .table(
      { prop: 'id', wontBudge: true, reorder: false, width: '40px' },
      { prop: 'name', reorder: true },
      { prop: 'gender', reorder: true, width: '50px' },
      { prop: 'birthdate', wontBudge: true, type: 'date', reorder: false }
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
