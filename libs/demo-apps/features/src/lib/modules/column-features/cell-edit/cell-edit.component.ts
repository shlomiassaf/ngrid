/* @neg-example:ex-1 ex-2 ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { NegTableCellContext, createDS, columnFactory } from '@neg/table';
import { Person, DemoDataSource } from '@neg/demo-apps/shared';

@Component({
  selector: 'neg-cell-edit-table-example-component',
  templateUrl: './cell-edit.component.html',
  styleUrls: ['./cell-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CellEditTableExampleComponent {

  /* @neg-ignore:ex-2 ex-3 */
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
  /* @neg-ignore:ex-2 ex-3 */
  /* @neg-ignore:ex-1 ex-3 */
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

  changeCheckbox(input: HTMLInputElement, ctx: NegTableCellContext): void {
    ctx.value = input.checked;
    setTimeout( () => ctx.stopEdit(true) );
  }
  /* @neg-ignore:ex-1 ex-3 */
  /* @neg-ignore:ex-1 ex-2 */
  columns3 = columnFactory()
  .table(
    { prop: 'id', width: '40px' },
    { prop: 'name' },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date', editable: true },
  )
  .build();
  ds3 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @neg-ignore:ex-1 ex-2 */

  constructor(private datasource: DemoDataSource, private cdr: ChangeDetectorRef) {}
}
/* @neg-example:ex-1 ex-2 ex-3 */
