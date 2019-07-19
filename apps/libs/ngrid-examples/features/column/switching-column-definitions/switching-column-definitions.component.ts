import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

const COLUMNS_VIEW_1 = columnFactory()
  .table(
    { prop: 'id', width: '40px' },
    { prop: 'name', },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate' },
  )
  .build();

const COLUMNS_VIEW_2 = columnFactory()
  .table(
    { prop: '__list_item_view__' },
  )
  .build();


@Component({
  selector: 'pbl-switching-column-definitions-example',
  templateUrl: './switching-column-definitions.component.html',
  styleUrls: ['./switching-column-definitions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-switching-column-definitions-example', { title: 'Switching Column Definitions' })
export class SwitchingColumnDefinitionsExample {
  columns = COLUMNS_VIEW_1;
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) {}

  toggleView(): void {
    this.columns = this.columns === COLUMNS_VIEW_1 ? COLUMNS_VIEW_2 : COLUMNS_VIEW_1;
  }
}
