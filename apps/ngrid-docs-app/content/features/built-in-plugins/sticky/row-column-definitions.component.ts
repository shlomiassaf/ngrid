import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-row-column-definitions-example',
  templateUrl: './row-column-definitions.component.html',
  styleUrls: ['./row-column-definitions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-row-column-definitions-example', { title: 'Sticky Row with Column Definition' })
export class RowColumnDefinitionsExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      {
        header: { type: 'sticky' },
        footer: { type: 'sticky' }
      },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .header(
      { type: 'fixed' },
      { id: 'HEADER1', label: `I'M A FIXED HEADER` },
    )
    .header(
      { type: 'row' },
      { id: 'HEADER2', label: `I'M A ROW HEADER` },
    )
    .header(
      { type: 'sticky' },
      { id: 'HEADER3', label: `I'M A STICKY HEADER` },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
