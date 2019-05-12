/* @pebula-example:ex-1 ex-2 ex-3 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { PblNgridComponent, PblNgridCellContext, createDS, columnFactory } from '@pebula/ngrid';
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
      { prop: 'name', editable: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate' },
      { prop: '__isFirstRender', label: 'First Render?', width: '60px' },
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

  changeCheckbox(input: HTMLInputElement, ctx: PblNgridCellContext): void {
    ctx.value = input.checked;
    setTimeout( () => ctx.stopEdit(true) );
  }

  update(grid: PblNgridComponent): void {
    // This is how we get the render position of a column:
    const nameColumn = grid.columnApi.findColumn('name');
    const nameColumnIndex = grid.columnApi.renderIndexOf(nameColumn);

    // We could also show a list of which row to apply it on instead of a fixed number
    // by iterating on `grid.ds.renderLength`

    grid.contextApi.getCell(3, nameColumnIndex).startEdit(true);
  }
}
/* @pebula-example:ex-1 ex-2 ex-3 */
