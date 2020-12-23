import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-columns-factory-example',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-columns-factory-example', { title: 'Column Factory' })
export class ColumnsFactoryExample {
  columns = columnFactory()
    .default({ minWidth: 40 })
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email', width: '150px' },
      { prop: 'country' },
      { prop: 'language' },
    )
    .header(
      { id: 'header1', label: 'Header 1', width: '25%'},
      { id: 'header2', label: 'Header 2'},
    )
    .headerGroup(
      {
        label: 'Name & Gender',
        columnIds: ['name', 'gender'],
      },
    )
    .header(
      { id: 'header3', label: 'Header 3'},
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
    .footer(
      { id: 'footer1', label: 'Footer 1', width: '25%'},
      { id: 'footer2', label: 'Footer 2'},
    )
    .footer(
      { id: 'footer3', label: 'Footer 3'},
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
