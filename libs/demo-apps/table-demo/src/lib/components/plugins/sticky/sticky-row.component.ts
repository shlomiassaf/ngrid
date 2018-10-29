/* @sac-example:ex-row-1 */
/* @sac-example:ex-row-2 */
/* @sac-example:ex-row-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@sac/table';

import { Person, DemoDataSource } from '@sac/demo-apps/shared';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .header(
    { id: 'MULTI_HEADER_1', label: 'MULTI HEADER 1' },
  )
  .header(
    { id: 'MULTI_HEADER_2_1', label: 'MULTI HEADER 2: Col 1' },
    { id: 'MULTI_HEADER_2_2', label: 'MULTI HEADER 2: Col 2' },
  )
  .footer(
    { id: 'MULTI_FOOTER_1', label: 'This table is the property of Nobody & CO (LLC)' },
  )
  .build();

@Component({
  selector: 'sac-sticky-row-table-example-component',
  templateUrl: './sticky-row.component.html',
  styleUrls: ['./sticky-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyRowTableExampleComponent {
  columns = columnFactory().table(...COLUMNS.table).build(); /* @sac-ignore-line:ex-row-3 */
  columnsWithMultiHeaders = COLUMNS; /* @sac-ignore-line:ex-row-1 */ /* @sac-ignore-line:ex-row-2 */

  dataSource = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @sac-example:ex-row-3 */
/* @sac-example:ex-row-2 */
/* @sac-example:ex-row-1 */
