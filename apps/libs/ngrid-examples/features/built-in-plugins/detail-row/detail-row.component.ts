import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-detail-row-example',
  templateUrl: './detail-row.component.html',
  styleUrls: ['./detail-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-detail-row-example', { title: 'Detail Row' })
export class DetailRowExample {
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
