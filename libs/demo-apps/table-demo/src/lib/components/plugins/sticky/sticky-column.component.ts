/* @sac-example:ex-column-1 */
/* @sac-example:ex-column-2 */
/* @sac-example:ex-column-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@sac/table';

import { Person, getPersons } from '../../../services';

const COLUMNS = columnFactory()
  .default({minWidth: 200})
  .table(
    { prop: 'id', width: '40px' },
    { prop: 'name', width: '100px' },
    { prop: 'gender' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'lead' },
    { prop: 'settings.avatar' },
    { prop: 'settings.background' },
    { prop: 'settings.timezone' },
    { prop: 'settings.emailFrequency' },
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
  selector: 'sac-sticky-column-table-example-component',
  templateUrl: './sticky-column.component.html',
  styleUrls: ['./sticky-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyColumnTableExampleComponent {

  columns1 = columnFactory().table(...COLUMNS.table).build();

  dataSource = createDS<Person>()
    .onTrigger( () => getPersons(0).pipe(map( data => data.slice(0, 15) ) ) )
    .create();
}
/* @sac-example:ex-column-3 */
/* @sac-example:ex-column-2 */
/* @sac-example:ex-column-1 */
