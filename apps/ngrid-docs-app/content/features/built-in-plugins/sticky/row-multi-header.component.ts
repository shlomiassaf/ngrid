import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-row-multi-header-example',
  templateUrl: './row-multi-header.component.html',
  styleUrls: ['./row-multi-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-row-multi-header-example', { title: 'Sticky Rows: Multi-Header Row Setup' })
export class RowMultiHeaderExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { header: { type: 'sticky' } },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .header(
      { type: 'sticky' },
      { id: 'MULTI_HEADER_1', label: 'MULTI HEADER 1' },
    )
    .header(
      { id: 'MULTI_HEADER_2_1', label: 'MULTI HEADER 2: Col 1' },
      { id: 'MULTI_HEADER_2_2', label: 'MULTI HEADER 2: Col 2' },
    )
    .footer(
      // { type: 'sticky' },
      { id: 'MULTI_FOOTER_1_1', label: 'MULTI FOOTER 1: Col 1' },
      { id: 'MULTI_FOOTER_1_2', label: 'MULTI FOOTER 2: Col 2' },
    )
    .footer(
      // { type: 'sticky' },
      { id: 'MULTI_FOOTER_2', label: 'This table is the property of Nobody & CO (LLC)' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
