/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@sac/table';
import { SgTableRowEvent, SgTableCellEvent } from '@sac/table/target-events';

import { Person, getPersons } from '../../services';

function isCellEvent<T>(event: SgTableRowEvent<T> | SgTableCellEvent<T>): event is SgTableCellEvent<T> {
  return !!(event as  SgTableCellEvent<T>).cellTarget;
}

const COLUMNS = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' }
  )
  .build();

const COLUMNS2 = columnFactory()
  .default({minWidth: 100})
  .table(
    { prop: 'id', sort: true, width: '40px' },
    { prop: 'name', sort: true },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date' },
    { prop: 'bio' },
    { prop: 'email', minWidth: 250, width: '250px' },
    { prop: 'language', headerType: 'language' },
    { prop: 'lead' },
    { prop: 'avatar' },
    { prop: 'settings.background' },
    { prop: 'settings.timezone' },
    { prop: 'settings.emailFrequency' },
    { prop: 'lastLoginIp' }
  )
  .header(
    { id: 'HEADER', label: 'A SIMPLE 1 CELL HEADER' },
  )
  .headerGroup(
    {
      prop: 'name',
      span: 4,
      label: 'Personal Info',
    },
    {
      prop: 'settings.background',
      span: 2,
      label: 'User Settings',
    }
  )
  .footer(
    { id: 'FOOTER', label: 'A SIMPLE 1 CELL FOOTER' },
  )
  .build();

@Component({
  selector: 'sac-target-events-table-example-component',
  templateUrl: './target-events.component.html',
  styleUrls: ['./target-events.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetEventsTableExampleComponent {


  columns = COLUMNS;
  columns2 = COLUMNS2;

  ds1 = createDS<Person>()
    .onTrigger( () => getPersons(0).pipe(map( data => data.slice(0, 15) )) )
    .create();

  ds2 = createDS<Person>()
    .onTrigger( () => getPersons(0).pipe(map( data => data.slice(0, 5) )) )
    .create();

  onClickEvents(event: SgTableRowEvent<Person> | SgTableCellEvent<Person>) {
    let cellSuffix = '';
    if (isCellEvent(event)) {
      cellSuffix = `  CELL: ${event.colIndex}`;
    } else {
      if (event.root)  {
        cellSuffix = ` [Bubbled from CELL: ${event.root.colIndex}]`;
      }
    }
    alert(`CLICK EVENT at ROW: ${event.rowIndex}${cellSuffix}\nType: ${event.type}\nSubType: ${event.subType}`);
  }

  onEnterLeaveEvents(event: SgTableRowEvent<Person> | SgTableCellEvent<Person>, isEnter = false) {
    if (isCellEvent(event)) {
      if (!isEnter) {
        event.cellTarget.style.background = null;
      } else {
        const cmap = {
          data: 'red',
          header: 'yellow',
          footer: 'pink',
          meta: 'green',
          'meta-group': 'blue',
        }
        const cmapBg = {
          data: `rgba(255,0,0,0.25)`,
          header: `rgba(255,255,0,0.25)`,
          footer: `rgba(255,192,203,0.25)`,
          meta: `rgba(0,128,0,0.25)`,
          'meta-group': `rgba(0,0,255,0.25)`,
        }
        event.cellTarget.style.background = cmap[event.subType] || cmap[event.type];
        event.rowTarget.style.background = cmapBg[event.subType] || cmapBg[event.type];
      }
    } else {
      if (!isEnter) {
        event.rowTarget.style.background = 'inherit';
      } else if (!event.root) {
        const cmap = {
          data: `rgba(255,0,0,1)`,
          header: `rgba(255,255,0,1)`,
          footer: `rgba(255,192,203,1)`,
          meta: `rgba(0,128,0,1)`,
          'meta-group': `rgba(0,0,255,1)`,
        }
        event.rowTarget.style.background = cmap[event.subType] || cmap[event.type];
      }
    }
  }
}
/* @sac-example:ex-3 */
/* @sac-example:ex-2 */
/* @sac-example:ex-1 */
