import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-column-with-directives-example',
  templateUrl: './column-with-directives.component.html',
  styleUrls: ['./column-with-directives.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-with-directives-example', { title: 'Sticky Columns with Directives' })
export class ColumnWithDirectivesExample {
  columns = columnFactory()
    .default({minWidth: 200})
    .table(
      { prop: 'id', minWidth: 40, width: '40px' },
      { prop: 'name', minWidth: 100, width: '100px' },
      { prop: 'gender' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'lead' },
      { prop: 'settings.avatar' },
      { prop: 'settings.background' },
      { prop: 'settings.timezone', minWidth: 60, width: '60px' },
      { prop: 'settings.emailFrequency', minWidth: 60, width: '60px' },
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

  constructor(private datasource: DynamicClientApi) { }
}
