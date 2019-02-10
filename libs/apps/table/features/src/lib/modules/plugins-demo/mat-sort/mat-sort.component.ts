/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { columnFactory, createDS, NegColumn } from '@pebula/table';
import { NegTableMatSortDirective } from '@pebula/table/material/sort';

import { Person, DemoDataSource } from '@pebula/apps/table/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', sort: true, width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .build();

@Component({
  selector: 'pbl-mat-sort-table-example-component',
  templateUrl: './mat-sort.component.html',
  styleUrls: ['./mat-sort.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSortTableExampleComponent {
  columns1 = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', sort: true, width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .build();

  columns = COLUMNS;
  simpleSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();
  defaultSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();
  progSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();

  constructor(private datasource: DemoDataSource) { }

  toggleActive(matSort: NegTableMatSortDirective, column: NegColumn, state: boolean): void {
    matSort.table.ds.setSort(column, { order: state ? 'asc' : undefined });
  }

  isActive(matSort: NegTableMatSortDirective, column: NegColumn): boolean {
    return matSort.sort.active === column.id && !!matSort.sort.direction;
  }
}
/* @pebula-example:ex-3 */
/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
