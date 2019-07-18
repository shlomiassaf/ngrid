import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-min-column-width-example-component',
  templateUrl: './min-column-width.component.html',
  styleUrls: ['./min-column-width.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-min-column-width-example-component', { title: 'Minimum Column Width' })
export class MinColumnWidthFeatureExample {

  columns = columnFactory()
    .table(
      { prop: 'name', minWidth: 500 },
      { prop: 'gender', minWidth: 500 },
      { prop: 'birthdate', type: 'date', minWidth: 500 },
      { prop: 'email', minWidth: 500 },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  constructor(private datasource: DemoDataSource) { }
}
