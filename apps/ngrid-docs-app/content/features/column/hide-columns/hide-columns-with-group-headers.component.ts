import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'bio', minWidth: 100, maxWidth: 150 },
    { prop: 'email', minWidth: 250, width: '250px' },
    { prop: 'country' },
    { prop: 'language', headerType: 'language' },
  )
  .headerGroup(
    {
      prop: 'name',
      span: 2,
      label: 'Personal Info',
    },
    {
      prop: 'email',
      span: 2,
      label: 'Contact Info',
    }
  )
  .build();

@Component({
  selector: 'pbl-hide-columns-with-group-headers-example-component',
  templateUrl: './hide-columns-with-group-headers.component.html',
  styleUrls: ['./hide-columns-with-group-headers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-hide-columns-with-group-headers-example-component', { title: 'Hide Columns with Group Headers' })
export class HideColumnWithGroupHeadersFeatureExample {

  hideColumns: string[] = [];
  columns = COLUMNS;
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DemoDataSource) { }

  toggleColumn(coll: string[], id: string): void {
    const idx = coll.indexOf(id);
    if (idx === -1) {
      coll.push(id);
    } else {
      coll.splice(idx, 1);
    }
  }
}
