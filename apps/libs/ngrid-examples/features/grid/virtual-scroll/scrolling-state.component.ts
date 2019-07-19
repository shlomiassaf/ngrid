import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-scrolling-state-example',
  templateUrl: './scrolling-state.component.html',
  styleUrls: ['./scrolling-state.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-scrolling-state-example', { title: 'Scrolling State' })
export class ScrollingStateExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = this.createDatasource();
  isScrolling: -1 | 0 | 1 = 0;

  constructor(private datasource: DemoDataSource) { }

  createDatasource() {
    return createDS<Person>()
      .onTrigger( () => this.datasource.getPeople(0, 1500) )
      .create();
  }
}
