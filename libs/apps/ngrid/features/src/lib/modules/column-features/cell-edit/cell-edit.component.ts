/* @pebula-example:ex-1 ex-2 ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { PblNgridCellContext, createDS, columnFactory } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

@Component({
  selector: 'pbl-cell-edit-grid-example-component',
  templateUrl: './cell-edit.component.html',
  styleUrls: ['./cell-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditGridExampleComponent {

  /* @pebula-ignore:ex-2 ex-3 */
  columns1 = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'ttt', width: '40px' },
      { prop: 'name', editable: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate' },
    )
    .build();
  ds1 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @pebula-ignore:ex-2 ex-3 */
  /* @pebula-ignore:ex-1 ex-3 */
  columns2 = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate' },
      { prop: 'lead', editable: true },
    )
    .build();
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  changeCheckbox(input: HTMLInputElement, ctx: PblNgridCellContext): void {
    ctx.value = input.checked;
    setTimeout( () => ctx.stopEdit(true) );
  }
  /* @pebula-ignore:ex-1 ex-3 */
  /* @pebula-ignore:ex-1 ex-2 */
  columns3 = columnFactory()
  .table(
    { prop: 'id', width: '40px' },
    { prop: 'name' },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date', editable: true },
  )
  .build();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @pebula-ignore:ex-1 ex-2 */

  constructor(private datasource: DemoDataSource, private cdr: ChangeDetectorRef) {}
}
/* @pebula-example:ex-1 ex-2 ex-3 */
