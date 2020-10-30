import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
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
      { prop: 'id', width: '50px', pIndex: true },
      { prop: 'name', width: '25%' },
      { prop: 'email', minWidth: 450},
      { prop: 'country', width: '35%' },
      { prop: 'language', maxWidth: 50 },
      { prop: 'settings.timezone', label: 'TZ', width: '30px' },
      { prop: 'balance' },
      { prop: 'gender' },
    )
    .headerGroup(
      { prop: 'name', span: 1, label: 'Name & Email' },
      { prop: 'country', span: 1, label: 'Country & Language' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  constructor(private datasource: DemoDataSource) { }
}
