/* @pebula-example:ex-1 ex-2 ex-3 ex-4  */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { NegTableComponent, createDS, columnFactory } from '@pebula/table';
import { Person, DemoDataSource } from '@pebula/apps/table/shared';

@Component({
  selector: 'neg-column-reorder-table-example-component',
  templateUrl: './column-reorder.component.html',
  styleUrls: ['./column-reorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnReorderTableExampleComponent {

  /* @pebula-ignore:ex-2 ex-3 ex-4 */
  columns1 = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  move(table: NegTableComponent<Person>): void {
    const id = table.columnApi.findColumn('id');
    const gender = table.columnApi.findColumn('gender');
    table.columnApi.moveColumn(id, gender);
  }

  swap(table: NegTableComponent<Person>): void {
    const name = table.columnApi.findColumn('name');
    const birthdate = table.columnApi.findColumn('birthdate');
    table.columnApi.swapColumns(name, birthdate);
  }
  /* @pebula-ignore:ex-2 ex-3 ex-4 */
  /* @pebula-ignore:ex-1 ex-3 ex-4 */
  columns2 = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', reorder: true },
      { prop: 'gender', reorder: true, width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @pebula-ignore:ex-1 ex-3 ex-4 */
  /* @pebula-ignore:ex-1 ex-2 ex-4  */
  columns3 = columnFactory()
    .table(
      { prop: 'id', wontBudge: true, width: '40px' },
      { prop: 'name', reorder: true },
      { prop: 'gender', reorder: true, width: '50px' },
      { prop: 'birthdate', wontBudge: true, type: 'date', reorder: true }
    )
    .build();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create(); /* @pebula-ignore:ex-1 ex-2 ex-4  */
  /* @pebula-ignore:ex-1 ex-2 ex-3  */
  columns4 = columnFactory()
    .default({ reorder: true })
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
        label: 'Un-Locked'
      },
      {
        prop: 'country',
        span: 1,
        label: 'Locked',
        lockColumns: true,
      }
    )
    .build();
  ds4 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @pebula-ignore:ex-1 ex-2 ex-3  */

  constructor(private datasource: DemoDataSource) {}
}
/* @pebula-example:ex-1 ex-2 ex-3 ex-4  */
