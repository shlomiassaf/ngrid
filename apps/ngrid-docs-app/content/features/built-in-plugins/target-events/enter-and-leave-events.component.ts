import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { createDS, columnFactory } from '@pebula/ngrid';
import { PblNgridRowEvent, PblNgridCellEvent } from '@pebula/ngrid/target-events';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

function isCellEvent<T>(event: PblNgridRowEvent<T> | PblNgridCellEvent<T>): event is PblNgridCellEvent<T> {
  return !!(event as  PblNgridCellEvent<T>).cellTarget;
}

@Component({
  selector: 'pbl-enter-and-leave-events-example',
  templateUrl: './enter-and-leave-events.component.html',
  styleUrls: ['./enter-and-leave-events.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-enter-and-leave-events-example', { title: 'Cell/Row -> Enter/Leave Events' })
export class EnterAndLeaveEventsExample {
  columns = columnFactory()
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
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 90) ).create();

  constructor(private datasource: DynamicClientApi) { }

  onEnterLeaveEvents(event: PblNgridRowEvent<Person> | PblNgridCellEvent<Person>, isEnter = false) {
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
