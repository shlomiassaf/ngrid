import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

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
      { prop: 'name', span: 1, label: 'Name & Gender' },
      { prop: 'country', span: 1, label: 'Country & Language' },
    )
    .header(
      { id: 'header1', label: 'Header 1', width: '25%'},
      { id: 'header2', label: 'Header 2'},
      { id: 'header3', label: 'Header 3', width: '25%'},
    )
    .headerGroup(
      { prop: 'id', span: 2, label: 'ID, Name & Gender' },
      { prop: 'country', span: 1, label: 'Country & Language' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
