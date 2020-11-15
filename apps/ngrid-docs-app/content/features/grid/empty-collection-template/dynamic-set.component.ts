import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-dynamic-set-example',
  templateUrl: './dynamic-set.component.html',
  styleUrls: ['./dynamic-set.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-dynamic-set-example', { title: 'Dynamic Set' })
export class DynamicSetExample {
  columns = columnFactory()
    .default({minWidth: 200})
    .table(
      { prop: 'id' },
      { prop: 'name' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => [] ).create();

  dynamicSteps = [
    'Sync -> No Data',
    'Async (1 sec) -> Data',
    'Async (1 sec) -> No Data',
    'Sync -> Data',
  ];

  currentDynamicStep = 0;

  constructor(private datasource: DynamicClientApi) { }

  moveToStep(step: number): void {
    this.currentDynamicStep = step;
    switch (step) {
      case 0:
        this.ds = createDS<Person>().onTrigger( () => [] ).create();
        break;
      case 1:
        this.ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000, 5) ).create();
        break;
      case 2:
        this.ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000, 0) ).create();
        break;
      case 3:
        this.ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();
        break;
    }
  }
}
