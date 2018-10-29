/* @sac-example:ex-1 */
/* @sac-example:ex-2 */
/* @sac-example:ex-3 */
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@sac/table';
import { SgTableRowEvent, SgTableCellEvent } from '@sac/table/target-events';

import { Person, DemoDataSource } from '@sac/demo-apps/shared';

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
    { prop: 'settings.avatar' },
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
      prop: 'settings.avatar',
      span: 3,
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

  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  constructor(private datasource: DemoDataSource) { }

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
      if (isEnter) {
        event.cellTarget.classList.add('cell-hovered');
        event.rowTarget.classList.add('row-cell-hovered');
      } else {
        event.cellTarget.classList.remove('cell-hovered');
        event.rowTarget.classList.remove('row-cell-hovered');
      }
    } else {
      if (isEnter) {
        event.rowTarget.classList.add('row-hovered');
      } else {
        event.rowTarget.classList.remove('row-hovered');
        event.rowTarget.classList.remove('row-cell-hovered');
      }
    }
  }
}
/* @sac-example:ex-3 */
/* @sac-example:ex-2 */
/* @sac-example:ex-1 */
