/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .build();


@Component({
  selector: 'pbl-action-row-grid-example-component',
  templateUrl: './action-row.component.html',
  styleUrls: ['./action-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionRowStoryGridExampleComponent {

  columns = COLUMNS;
  ds1 = createDS<Person>()
    .onTrigger( () => this.datasource.getPeople(500, 500) )
    .create();

    constructor(private datasource: DemoDataSource) {}
}
/* @pebula-example:ex-1 */
