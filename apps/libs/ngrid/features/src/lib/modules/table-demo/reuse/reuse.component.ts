/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Seller, Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

function buildColumns(mode: 'person' | 'seller') {
  if (mode === 'person') {
    return columnFactory()
      .table(
        { prop: 'id', sort: true, width: '40px' },
        { prop: 'name', sort: true },
        { prop: 'gender', width: '50px' },
        { prop: 'birthdate', type: 'date' },
        { prop: 'bio' },
        { prop: 'email', minWidth: 250, width: '250px' },
        { prop: 'language', headerType: 'language' },
      )
      .build();
  } else {
    return columnFactory()
      .table(
        { prop: 'id', sort: true, width: '40px', wontBudge: true },
        { prop: 'name', sort: true },
        { prop: 'email', minWidth: 250, width: '150px' },
        { prop: 'address' },
        { prop: 'rating', type: 'starRatings', width: '120px' }
      )
      .build();
  }
}

function createSource(mode: 'person' | 'seller', datasource: DemoDataSource) {
  if (mode === 'person') {
    return createDS<Person>().onTrigger(() => {
      return datasource.getPeople(1000, 15);
    }).create();
  } else {
    return createDS<Seller>().onTrigger(() => {
      return datasource.getSellers(1000, 15)
    }).create();
  }
};

@Component({
  selector: 'pbl-reuse-grid-example-component',
  templateUrl: './reuse.component.html',
  styleUrls: ['./reuse.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReuseGridExampleComponent {


  dynamicColumns;
  dynamicColumnsDs = createDS<Person | Seller>().onTrigger(() => {
    if (this.viewMode === 'person') {
      return this.datasource.getPeople(1000, 15);
    } else {
      return this.datasource.getSellers(1000, 15)
    }
  }).create();

  columns = buildColumns('person');
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  viewMode: 'person' | 'seller' = 'person';

  constructor(private datasource: DemoDataSource) {
    this.toggleViewMode();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'person' ? 'seller' : 'person';
    this.dynamicColumnsDs = createSource(this.viewMode, this.datasource);
    this.dynamicColumns = buildColumns(this.viewMode);
    this.dynamicColumnsDs.refresh();
  }
}
/* @pebula-example:ex-1 */
