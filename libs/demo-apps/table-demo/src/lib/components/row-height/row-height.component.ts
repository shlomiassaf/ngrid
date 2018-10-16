/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@sac/table';

import { Person, getPersons } from '../../services';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'bio' },
    { prop: 'email', minWidth: 250, width: '250px' },
    { prop: 'language', headerType: 'language' },
  )
  .build();

@Component({
  selector: 'sac-row-height-table-example-component',
  templateUrl: './row-height.component.html',
  styleUrls: ['./row-height.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowHeightTableExampleComponent {


  columns = COLUMNS;
  ds1 = createDS<Person>()
    .onTrigger( () => getPersons(0).pipe(map( data => data.slice(0, 15) )) )
    .create();

}
/* @sac-example:ex-3 */
/* @sac-example:ex-2 */
/* @sac-example:ex-1 */
