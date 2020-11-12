import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-column-mix-setup-example',
  templateUrl: './column-mix-setup.component.html',
  styleUrls: ['./column-mix-setup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-mix-setup-example', { title: 'Column Mix Setup' })
export class ColumnMixSetupExample {
  columns = columnFactory()
    .default({minWidth: 200})
    .table(
      { prop: 'id', minWidth: 40, width: '40px', pin: 'start' },
      { prop: 'name', minWidth: 100, width: '100px' },
      { prop: 'gender' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'lead' },
      { prop: 'settings.avatar' },
      { prop: 'settings.background' },
      { prop: 'settings.timezone', minWidth: 60, width: '60px' },
      { prop: 'settings.emailFrequency', minWidth: 60, width: '60px', pin: 'end' },
    )
    .header(
      { id: 'MULTI_HEADER_1', label: 'MULTI HEADER 1' },
    )
    .header(
      { id: 'MULTI_HEADER_2_1', label: 'MULTI HEADER 2: Col 1' },
      { id: 'MULTI_HEADER_2_2', label: 'MULTI HEADER 2: Col 2' },
    )
    .footer(
      { id: 'MULTI_FOOTER_1', label: 'This table is the property of Nobody & CO (LLC)' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DemoDataSource) { }
}
