/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { columnFactory, createDS, PblColumn, PblNgridSortOrder } from '@pebula/ngrid';
import { PblNgridMatSortDirective } from '@pebula/ngrid-material/sort';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

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
  selector: 'pbl-mat-sort-grid-example-component',
  templateUrl: './mat-sort.component.html',
  styleUrls: ['./mat-sort.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatSortGridExampleComponent {
  columns = COLUMNS;
  simpleSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();
  defaultSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();
  progSortDS = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();

  constructor(private datasource: DemoDataSource) { }

  clear(): void {
    this.progSortDS.setSort();
  }

  toggleActive(columnId: string): void {
    const currentSort = this.progSortDS.sort;
    let order: PblNgridSortOrder = 'asc';
    if (currentSort && currentSort.column && currentSort.column.id === columnId) {
      order = currentSort.sort && currentSort.sort.order as any;
      if (order === 'asc') {
        order = 'desc';
      } else if (order === 'desc') {
        this.clear();
        return;
      } else {
        order = 'asc';
      }
    }
    this.progSortDS.hostGrid.setSort(columnId, { order });
  }

  getNextDirection(key: string): string {
    const sort = this.progSortDS.sort;
    if (!sort.column || sort.column.id !== key) {
      return 'asc';
    } else {
      return sort.sort.order === 'asc' ? 'desc' : 'clear';
    }
  }
}
/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
