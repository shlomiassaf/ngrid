/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { createDS, columnFactory, PblColumn, PblNgridSortInstructions } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', sort: true, width: '50px' },
    { prop: 'birthdate', type: 'date', sort: true }
  )
  .build();

@Component({
  selector: 'pbl-column-sorting-grid-example-component',
  templateUrl: './column-sorting.component.html',
  styleUrls: ['./column-sorting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnSortingGridExampleComponent {
  columns = COLUMNS;
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();

  constructor(private datasource: DemoDataSource) { }

  clear(): void {
    this.ds.setSort();
  }

  toggleActive(columnId: string, state: boolean): void {
    this.ds.hostGrid.setSort(columnId, { order: state ? 'asc' : undefined });
  }

}
/* @pebula-example:ex-1 */
