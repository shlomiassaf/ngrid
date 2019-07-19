import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-multi-column-filter-example',
  templateUrl: './multi-column-filter.component.html',
  styleUrls: ['./multi-column-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-multi-column-filter-example', { title: 'Multi Column Filter' })
export class MultiColumnFilterExample {
  columns = columnFactory()
    .table(
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
