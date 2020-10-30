import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblColumn } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-multi-column-filter-example',
  templateUrl: './multi-column-filter.component.html',
  styleUrls: ['./multi-column-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-multi-column-filter-example', { title: 'Multi Column Filter' })
export class MultiColumnFilterExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();
  inputValue: string;
  selectValue: string;

  myPredicate = (item: any, columns: PblColumn[]): boolean => {
    if (!this.inputValue && !this.selectValue) { return true; }

    if (this.inputValue) {
      const col = this.ds.hostGrid.columnApi.findColumn('name');
      const inputValue = this.inputValue.trim().toLowerCase();
      // text search match is permissive, i.e: contains the value anywhere
      const hasInputValue = col.getValue(item).trim().toLowerCase().indexOf(inputValue) !== -1;
      if (hasInputValue) {
        return true;
      }
    }

    if (this.selectValue) {
      const col = this.ds.hostGrid.columnApi.findColumn('gender');
      // this time we want an exact match
      const selectValue = this.selectValue.trim();
      const hasSelectValue = col.getValue(item) === selectValue;
      if (hasSelectValue) {
        return true;
      }
    }
  }

  constructor(private datasource: DemoDataSource) {
    this.ds.setFilter(this.myPredicate);
  }

  doFilter(filterValue: string) {
    this.ds.syncFilter();
  }
}
