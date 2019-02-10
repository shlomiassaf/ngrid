/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

const COLUMNS1 = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'bio' },
    { prop: 'email', minWidth: 250, width: '250px' },
    { prop: 'language', headerType: 'language' },
  )
  .build();

const COLUMNS2 = columnFactory()
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
  selector: 'pbl-hide-columns-grid-example-component',
  templateUrl: './hide-columns.component.html',
  styleUrls: ['./hide-columns.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HideColumnsGridExampleComponent {

  hideColumns1: string[] = [];
  columns1 = COLUMNS1;
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  hideColumns2: string[] = [];
  columns2 = COLUMNS2;
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

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
/* @pebula-example:ex-3 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-1 */
