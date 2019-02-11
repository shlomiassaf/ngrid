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
    { prop: 'selection', width: '48px' },
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'bio' },
    { prop: 'email', minWidth: 250, width: '250px' },
    { prop: 'language', headerType: 'language' },
  )
  .build();


@Component({
  selector: 'pbl-selection-column-grid-example-component',
  templateUrl: './selection-column.component.html',
  styleUrls: ['./selection-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionColumnGridExampleComponent {

  columns1 = COLUMNS1;
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  bulkSelectMode: 'all' | 'view' | 'none' = 'all';
  columns2 = COLUMNS1;
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @pebula-example:ex-3 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-1 */
