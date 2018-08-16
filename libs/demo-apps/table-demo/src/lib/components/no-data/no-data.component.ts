/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnDestroy } from '@angular/core';

import { createDS, columnFactory } from '@sac/table';

const MOCKDATA = [
  { id: 1, name: 'Jhon' },
  { id: 2, name: 'Gayle ' },
  { id: 3, name: 'Lannie' },
  { id: 4, name: 'Lindsy' },
  { id: 5, name: 'Elden' }
]
const COLUMNS = columnFactory()
  .default({minWidth: 200})
  .table(
    { prop: 'id' },
    { prop: 'name' },
  )
  .build().all;

@Component({
  selector: 'sac-no-data-table-example-component',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataTableExampleComponent implements OnDestroy {

  columns = COLUMNS;

  syncDataSource = createDS<any>().onTrigger( () => [] ).create();
  aSyncDataSource = createDS<any>().onTrigger( () => of([]).pipe(delay(1000)) ).create();

  dynamicDataSource = this.syncDataSource;

  dynamicSteps = [
    'Sync -> No Data',
    'Async (1 sec) -> Data',
    'Async (1 sec) -> No Data',
    'Sync -> Data',
  ];

  currentDynamicStep = 0;

  ngOnDestroy(): void {
    this.syncDataSource.dispose();
  }

  moveToStep(step: number): void {
    this.currentDynamicStep = step;
    switch (step) {
      case 0:
        this.dynamicDataSource = createDS<any>().onTrigger( () => [] ).create();
        break;
      case 1:
        this.dynamicDataSource = createDS<any>().onTrigger( () => of(MOCKDATA).pipe(delay(1000)) ).create();
        break;
      case 2:
        this.dynamicDataSource = createDS<any>().onTrigger( () => of([]).pipe(delay(1000)) ).create();
        break;
      case 3:
        this.dynamicDataSource = createDS<any>().onTrigger( () => of(MOCKDATA) ).create();
        break;
    }
  }
}
/* @sac-example:ex-3 */
/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
