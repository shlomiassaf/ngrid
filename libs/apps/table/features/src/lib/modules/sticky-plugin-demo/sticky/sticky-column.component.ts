/* @neg-example:ex-column-1 ex-column-2 ex-column-3 ex-column-4 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@neg/table';
import { Person, DemoDataSource } from '@neg/apps/table/shared';

function createColumns(pinned: { start?: string[], end?: string[] } = {}) {
  const COLUMNS = columnFactory()
    .default({minWidth: 200})
    .table(
      { prop: 'id', minWidth: 40, width: '40px', pin: 'start' },
      { prop: 'name', minWidth: 100, width: '100px' },
      { prop: 'gender' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'lead' },
      { prop: 'settings.avatar' },
      { prop: 'settings.background' },
      { prop: 'settings.timezone', minWidth: 60, width: '60px' },
      { prop: 'settings.emailFrequency', minWidth: 60, width: '60px' },
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

  const { start, end } = pinned;
  COLUMNS.table.cols.forEach( c => {
    if (start && start.indexOf(c.id) > -1) {
      c.pin = 'start';
    } else if (end && end.indexOf(c.id) > -1) {
      c.pin = 'end';
    }
  });
  return COLUMNS;
}


@Component({
  selector: 'neg-sticky-column-table-example-component',
  templateUrl: './sticky-column.component.html',
  styleUrls: ['./sticky-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyColumnTableExampleComponent {

  columnsDef = createColumns({ start: ['id', 'name'], end: ['settings.timezone', 'settings.emailFrequency'] });
  columnsPlugin = createColumns();
  columnsMix = createColumns({ start: ['id'], end: ['settings.emailFrequency'] });

  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @neg-example:ex-column-1 ex-column-2 ex-column-3 ex-column-4 */
