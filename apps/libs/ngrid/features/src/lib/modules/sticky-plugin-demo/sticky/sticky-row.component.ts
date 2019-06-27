/* @pebula-example:ex-row-1 */
/* @pebula-example:ex-row-2 */
/* @pebula-example:ex-row-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

@Component({
  selector: 'pbl-sticky-row-grid-example-component',
  templateUrl: './sticky-row.component.html',
  styleUrls: ['./sticky-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyRowGridExampleComponent {

  /* @pebula-ignore:ex-2 ex-3 */
  columnsDef = columnFactory()
    .default({minWidth: 100})
    .table(
      {
        header: { type: 'sticky' },
        footer: { type: 'sticky' }
      },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .header(
      { type: 'fixed' },
      { id: 'HEADER1', label: `I'M A FIXED HEADER` },
    )
    .header(
      { type: 'row' },
      { id: 'HEADER2', label: `I'M A ROW HEADER` },
    )
    .header(
      { type: 'sticky' },
      { id: 'HEADER3', label: `I'M A STICKY HEADER` },
    )
    .build();
  /* @pebula-ignore:ex-2 ex-3 */

  /* @pebula-ignore:ex-1 ex-3 */
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  /* @pebula-ignore:ex-1 ex-3 */

  /* @pebula-ignore:ex-1 ex-2 */
  columnsMulti = columnFactory()
    .default({minWidth: 100})
    .table(
      { header: { type: 'sticky' } },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .header(
      { type: 'sticky' },
      { id: 'MULTI_HEADER_1', label: 'MULTI HEADER 1' },
    )
    .header(
      { id: 'MULTI_HEADER_2_1', label: 'MULTI HEADER 2: Col 1' },
      { id: 'MULTI_HEADER_2_2', label: 'MULTI HEADER 2: Col 2' },
    )
    .footer(
      // { type: 'sticky' },
      { id: 'MULTI_FOOTER_1_1', label: 'MULTI FOOTER 1: Col 1' },
      { id: 'MULTI_FOOTER_1_2', label: 'MULTI FOOTER 2: Col 2' },
    )
    .footer(
      // { type: 'sticky' },
      { id: 'MULTI_FOOTER_2', label: 'This table is the property of Nobody & CO (LLC)' },
    )
    .build();
  /* @pebula-ignore:ex-1 ex-2 */

  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @pebula-example:ex-row-3 */
/* @pebula-example:ex-row-2 */
/* @pebula-example:ex-row-1 */
