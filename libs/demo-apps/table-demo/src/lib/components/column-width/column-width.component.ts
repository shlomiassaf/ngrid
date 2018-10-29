/* @neg-example:ex-1 */
/* @neg-example:ex-2 */
/* @neg-example:ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@neg/table';

import { Person, DemoDataSource } from '@neg/demo-apps/shared';

@Component({
  selector: 'neg-column-width-table-example-component',
  templateUrl: './column-width.component.html',
  styleUrls: ['./column-width.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnWidthTableExampleComponent {

  columns1 = columnFactory()
    .table(
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
      { prop: 'bio' },
    )
    .build();
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  columns2 = columnFactory()
    .table(
      { prop: 'name', minWidth: 500 },
      { prop: 'gender', minWidth: 500 },
      { prop: 'birthdate', type: 'date', minWidth: 500 },
      { prop: 'email', minWidth: 500 },
    )
    .build();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  columns3 = columnFactory()
    .table(
      { prop: 'name' },
      { prop: 'gender', maxWidth: 50 },
      { prop: 'birthdate', type: 'date', maxWidth: 100 },
      { prop: 'bio', maxWidth: 500 },
    )
    .build();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @neg-example:ex-3 */
/* @neg-example:ex-2 */
/* @neg-example:ex-1 */
