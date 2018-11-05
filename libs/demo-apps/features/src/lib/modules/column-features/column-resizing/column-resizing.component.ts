/* @neg-example:ex-1 ex-2 ex-3 ex-4 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NegTableComponent, createDS, columnFactory } from '@neg/table';
import { Person, DemoDataSource } from '@neg/demo-apps/shared';

@Component({
  selector: 'neg-column-resizing-table-example-component',
  templateUrl: './column-resizing.component.html',
  styleUrls: ['./column-resizing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnResizingTableExampleComponent {
  /* @neg-ignore:ex-2 ex-3 ex-4 */
  columns1 = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  resize(table: NegTableComponent<Person>): void {
    const id = table.columnApi.findColumn('id');
    table.columnApi.resizeColumn(id, '200px');
  }
  /* @neg-ignore:ex-2 ex-3 ex-4 */
  /* @neg-ignore:ex-1 ex-3 ex-4 */
  columns2 = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', resize: true },
      { prop: 'gender', resize: true, width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @neg-ignore:ex-1 ex-3 ex-4 */
  /* @neg-ignore:ex-1 ex-2 ex-4 */
  columns3 = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', resize: true, minWidth: 100, maxWidth: 300 },
      { prop: 'gender', resize: true, minWidth: 50 },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create(); /* @neg-ignore:ex-1 ex-2 ex-4 */
  /* @neg-ignore:ex-1 ex-2 ex-3 */
  columns4 = columnFactory()
    .default({ resize: true })
    .table(
      { prop: 'id', wontBudge: true, width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email', width: '150px' },
      { prop: 'country' },
      { prop: 'language' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'balance' },
    )
    .headerGroup(
      {
        prop: 'name',
        span: 1,
        label: 'Group A'
      },
      {
        prop: 'country',
        span: 1,
        label: 'Group B',
      }
    )
    .build();
  ds4 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @neg-ignore:ex-1 ex-2 ex-3 */

  constructor(private datasource: DemoDataSource) {}
}
/* @neg-example:ex-1 ex-2 ex-3 ex-4 */
