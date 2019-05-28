/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

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
  selector: 'pbl-switching-column-definitions-grid-example-component',
  templateUrl: './switching-column-definitions.component.html',
  styleUrls: ['./switching-column-definitions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchingColumnDefinitionsGridExampleComponent {

  columns1 = COLUMNS_VIEW_1;
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) {}

  toggleView(): void {
    this.columns1 = this.columns1 === COLUMNS_VIEW_1 ? COLUMNS_VIEW_2 : COLUMNS_VIEW_1;
  }
}
/* @pebula-example:ex-1 */
