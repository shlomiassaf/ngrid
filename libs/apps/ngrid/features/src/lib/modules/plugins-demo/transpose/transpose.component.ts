/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    // { prop: 'birthdate', type: 'date' },
    { prop: 'birthdate', type: { name: 'date', data: { format: 'dd MMM, yyyy' } } },
  )
  .build();

@Component({
  selector: 'pbl-transpose-grid-example-component',
  templateUrl: './transpose.component.html',
  styleUrls: ['./transpose.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransposeGridExampleComponent {

  columns = COLUMNS;
  transposeToggle = false;

  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 25) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @pebula-example:ex-3 */
/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
