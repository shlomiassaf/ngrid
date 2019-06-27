/* @pebula-example:ex-1 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

const COLUMNS = columnFactory()
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'email', minWidth: 250, width: '250px' },
    { prop: 'language', headerType: 'language' },
  )
  .build();

@Component({
  selector: 'pbl-filler-grid-example-component',
  templateUrl: './filler.component.html',
  styleUrls: ['./filler.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FillerGridExampleComponent {

  columns = COLUMNS;
  dsVScrollAuto = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 3) ).create();
  dsVScrollFixed = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 3) ).create();
  dsVScrollNone = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 3) ).create();

  constructor(private datasource: DemoDataSource) {  }
}
/* @pebula-example:ex-1 */
