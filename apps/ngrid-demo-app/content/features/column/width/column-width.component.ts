import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-column-width-example-component',
  templateUrl: './column-width.component.html',
  styleUrls: ['./column-width.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-width-example-component', { title: 'Column Width' })
export class ColumnWidthFeatureExample {

  columns = columnFactory()
    .table(
      { prop: 'id', width: '50px', pIndex: true },
      { prop: 'name', width: '25%' },
      { prop: 'email' },
      { prop: 'country', width: '35%' },
      { prop: 'language' },
      { prop: 'settings.timezone', label: 'TZ', width: '30px' },
      { prop: 'balance' },
      { prop: 'gender' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  constructor(private datasource: DemoDataSource) { }
}
