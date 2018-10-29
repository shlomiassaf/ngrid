/* @neg-example:ex-1 */
/* @neg-example:ex-2 */
/* @neg-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@neg/table';

import { Person, DemoDataSource } from '@neg/demo-apps/shared';

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
  selector: 'neg-selection-column-table-example-component',
  templateUrl: './selection-column.component.html',
  styleUrls: ['./selection-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionColumnTableExampleComponent {

  columns1 = COLUMNS1;
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  bulkSelectMode: 'all' | 'view' | 'none' = 'all';
  columns2 = COLUMNS1;
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @neg-example:ex-3 */
/* @neg-example:ex-2 */
/* @neg-example:ex-1 */
