/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@sac/table';
import { Person, DemoDataSource } from '@sac/demo-apps/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 200})
  .table(
    { prop: 'id' },
    { prop: 'name' },
  )
  .build();

@Component({
  selector: 'sac-block-ui-table-example-component',
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockUiTableExampleComponent {

  columns = COLUMNS;

  autoDataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000) ).create();
  manualDataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(1000) ).create();

  constructor(private datasource: DemoDataSource) { }

  refresh(): void {
    this.autoDataSource.refresh();
  }
}
/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
