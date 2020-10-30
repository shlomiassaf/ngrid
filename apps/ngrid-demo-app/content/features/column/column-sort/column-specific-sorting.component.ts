import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridSorter, PblColumn, PblNgridSortInstructions, PblNgridSortOrder } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

/**
 * Sorts by the length of the field
 */
const lengthSorter: PblNgridSorter = (column: PblColumn, sort: PblNgridSortInstructions, data: any[]): any[] => {
  const tol = sort.order === 'desc' ? -1 : 1;
  return data.sort( (p1: any, p2: any) => {
    const v1 = column.getValue(p1) || '';
    const v2 = column.getValue(p2) || '';
    if (v1.length > v2.length) {
      return -1 * tol;
    } else if (v2.length > v1.length) {
      return 1 * tol;
    }
    return 0;
  });
}

/**
 * Sorts by the email frequency of the field
 */
const emailFrequencySorter: PblNgridSorter = (column: PblColumn, sort: PblNgridSortInstructions, data: any[]): any[] => {
  const FREQ_MAP = {
    Never: 0,
    Yearly: 2,
    Seldom: 3,
    Often: 4,
    Weekly: 5,
    Daily: 6
  };

  const tol = sort.order === 'desc' ? -1 : 1;
  return data.sort( (p1: any, p2: any) => {
    const v1 = FREQ_MAP[column.getValue(p1) || 'Never'];
    const v2 = FREQ_MAP[column.getValue(p2) || 'Never'];
    if (v1 > v2) {
      return -1 * tol;
    } else if (v2 > v1) {
      return 1 * tol;
    }
    return 0;
  });
}

@Component({
  selector: 'pbl-column-specific-sorting-example',
  templateUrl: './column-specific-sorting.component.html',
  styleUrls: ['./column-specific-sorting.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-specific-sorting-example', { title: 'Column Specific Sorting' })
export class ColumnSpecificSortingExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', sort: lengthSorter },
      { prop: 'gender',width: '50px' },
      { prop: 'settings.emailFrequency', sort: emailFrequencySorter }
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  constructor(private datasource: DemoDataSource) { }

  clear(): void {
    this.ds.setSort();
  }

  toggleActive(columnId: string): void {
    const currentSort = this.ds.sort;
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
    this.ds.hostGrid.setSort(columnId, { order });
  }

  getNextDirection(key: string): string {
    const sort = this.ds.sort;
    if (!sort.column || sort.column.id !== key) {
      return 'asc';
    } else {
      return sort.sort.order === 'asc' ? 'desc' : 'clear';
    }
  }
}
