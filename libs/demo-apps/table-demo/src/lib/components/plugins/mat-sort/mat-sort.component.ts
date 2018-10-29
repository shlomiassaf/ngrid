/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { columnFactory, createDS, SgColumn } from '@sac/table';
import { SgTableMatSortDirective } from '@sac/table/material/sort';

import { Person, DemoDataSource } from '@sac/demo-apps/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', sort: true, width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .footer(
    { id: 'PAGINATOR', type: 'PAGINATOR' },
  )
  .build();

@Component({
  selector: 'sac-mat-sort-table-example-component',
  templateUrl: './mat-sort.component.html',
  styleUrls: ['./mat-sort.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSortTableExampleComponent {
  columns = COLUMNS;
  simpleSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();
  defaultSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();
  progSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();

  constructor(private datasource: DemoDataSource) { }

  toggleActive(matSort: SgTableMatSortDirective, column: SgColumn, state: boolean): void {
    matSort.table.dataSource.setSort(column, { order: state ? 'asc' : undefined });
  }

  isActive(matSort: SgTableMatSortDirective, column: SgColumn): boolean {
    return matSort.sort.active === column.id && !!matSort.sort.direction;
  }
}
/* @sac-example:ex-3 */
/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
