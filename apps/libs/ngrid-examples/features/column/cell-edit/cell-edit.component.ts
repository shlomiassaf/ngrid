import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-cell-edit-example',
  templateUrl: './cell-edit.component.html',
  styleUrls: ['./cell-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-cell-edit-example', { title: 'Cell Edit' })
export class CellEditExample {
  hideColumns = ['gender'];

  columns = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', editable: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate' },
      { prop: '__isFirstRender', label: 'First Render?', width: '60px' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }

  update(grid: PblNgridComponent): void {
    // This is how we get the render position of a column:
    const nameColumnIndex = grid.columnApi.indexOf('name');

    // We could also show a list of which row to apply it on instead of a fixed number
    // by iterating on `grid.ds.renderLength`

    grid.contextApi.getCell(3, nameColumnIndex).startEdit(true);
  }
}
