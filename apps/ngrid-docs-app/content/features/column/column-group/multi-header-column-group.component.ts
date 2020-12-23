import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-multi-header-column-group-example',
  templateUrl: './multi-header-column-group.component.html',
  styleUrls: ['./multi-header-column-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-multi-header-column-group-example', { title: 'Multi Header Column group' })
export class MultiHeaderColumnGroupExample {
  columns = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email', width: '150px' },
      { prop: 'country' },
      { prop: 'language' },
    )
    .headerGroup(
      {
        label: 'Name & Gender',
        columnIds: ['name', 'gender'],
      },
      {
        label: 'Country & Language',
        columnIds: ['country', 'language'],
      },
    )
    .header(
      { id: 'header1', label: 'Header 1', width: '25%'},
      { id: 'header2', label: 'Header 2'},
      { id: 'header3', label: 'Header 3', width: '25%'},
    )
    .headerGroup(
      {
        label: 'ID, Name & Gender',
        columnIds: ['id', 'name', 'gender'],
      },
      {
        label: 'Country & Language',
        columnIds: ['country', 'language'],
      },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
