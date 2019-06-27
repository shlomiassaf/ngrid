/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
/* @pebula-example:ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnDestroy } from '@angular/core';

import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 200})
  .table(
    { prop: 'id' },
    { prop: 'name' },
  )
  .build();

@Component({
  selector: 'pbl-no-data-grid-example-component',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataGridExampleComponent implements OnDestroy {

  columns = COLUMNS;

  syncDataSource = createDS<Person>().onTrigger( () => [] ).create();
  aSyncDataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000, 0) ).create();
  dynamicDataSource = createDS<Person>().onTrigger( () => [] ).create();

  dynamicSteps = [
    'Sync -> No Data',
    'Async (1 sec) -> Data',
    'Async (1 sec) -> No Data',
    'Sync -> Data',
  ];

  currentDynamicStep = 0;

  constructor(private datasource: DemoDataSource) { }

  ngOnDestroy(): void {
    this.syncDataSource.dispose();
  }

  moveToStep(step: number): void {
    this.currentDynamicStep = step;
    switch (step) {
      case 0:
        this.dynamicDataSource = createDS<Person>().onTrigger( () => [] ).create();
        break;
      case 1:
        this.dynamicDataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000, 5) ).create();
        break;
      case 2:
        this.dynamicDataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000, 0) ).create();
        break;
      case 3:
        this.dynamicDataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();
        break;
    }
  }
}
/* @pebula-example:ex-3 */
/* @pebula-example:ex-1 */
/* @pebula-example:ex-2 */
