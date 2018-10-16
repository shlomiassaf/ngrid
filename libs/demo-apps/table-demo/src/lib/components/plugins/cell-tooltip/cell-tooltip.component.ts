/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@sac/table';
import { SgTableCellEvent } from '@sac/table/target-events';

import { Person, getPersons } from '../../../services';

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'bio' },

  )
  .build();

@Component({
  selector: 'sac-cell-tooltip-table-example-component',
  templateUrl: './cell-tooltip.component.html',
  styleUrls: ['./cell-tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellTooltipTableExampleComponent {


  columns = COLUMNS;

  ds1 = createDS<Person>()
    .onTrigger( () => getPersons(0).pipe(map( data => data.slice(0, 15) )) )
    .create();

  ds2 = createDS<Person>()
    .onTrigger( () => getPersons(0).pipe(map( data => data.slice(0, 15) )) )
    .create();

  getTooltipMessage(event: SgTableCellEvent<Person>): string {
    return `${event.colIndex} / ${event.rowIndex} -> ${event.rowIndex % 2 ? 'ODD' : 'EVEN'} ROW\n\n${event.cellTarget.innerText}`;
  }
}
/* @sac-example:ex-3 */
/* @sac-example:ex-2 */
/* @sac-example:ex-1 */
