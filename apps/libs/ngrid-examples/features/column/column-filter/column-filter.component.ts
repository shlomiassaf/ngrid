import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridSortOrder } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';
import { Example } from '@pebula/apps/shared';

const numericFilter = (filterValue: number, colValue: number) => filterValue === colValue
const numericRangeFilter = (filterValue: { min: number, max: number }, colValue: number) => colValue > filterValue.min && colValue < filterValue.max

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', width: '40px' },
    { prop: 'name' },
    { prop: 'gender', width: '50px' },
    { prop: 'balance', width: '200px', filter: numericRangeFilter },
  )
  .build();


@Component({
  selector: 'pbl-column-filter-example',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-filter-example', { title: 'Column Filter' })
export class ColumnFilterExample {
  columns = COLUMNS;
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();

  constructor(private datasource: DemoDataSource) { }

  clearFilter(): void {
    this.ds.setFilter();
  }

  filterBalance(negative: boolean): void {
    if (negative) {
      this.ds.hostGrid.setFilter({ min: Number.MIN_SAFE_INTEGER, max: 0}, [ 'balance' ]);
    } else {
      this.ds.hostGrid.setFilter({ min: 0, max: Number.MAX_SAFE_INTEGER}, [ 'balance' ]);
    }
  }
}
