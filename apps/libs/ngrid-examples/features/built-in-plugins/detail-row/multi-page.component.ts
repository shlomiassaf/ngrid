import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-multi-page-example',
  templateUrl: './multi-page.component.html',
  styleUrls: ['./multi-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-multi-page-example', { title: 'Multi Page' })
export class MultiPageExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'detailRowHandle', label: ' ', type: 'detailRowHandle', minWidth: 48, maxWidth: 48 },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>()
    .onTrigger( () => {
      this.datasource.reset('people');
      return this.datasource.getPeople(500, 500);
    })
    .create();

  constructor(private datasource: DemoDataSource) { }
}
