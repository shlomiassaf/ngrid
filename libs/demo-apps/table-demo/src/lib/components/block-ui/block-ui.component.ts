/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
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
  selector: 'sac-block-ui-table-example-component',
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockUiTableExampleComponent implements OnDestroy {

  columns = COLUMNS;

  autoDataSource = createDS<any>().onTrigger( () => of(MOCKDATA).pipe(delay(1000)) ).create();
  manualDataSource = createDS<any>().onTrigger( () => of(MOCKDATA) ).create();

  currentDynamicStep = 0;

  ngOnDestroy(): void {
    this.autoDataSource.dispose();
    this.manualDataSource.dispose();
  }

  refresh(): void {
    this.autoDataSource.refresh();
  }
}
/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
