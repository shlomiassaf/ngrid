import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-resizing-with-the-api-example',
  templateUrl: './resizing-with-the-api.component.html',
  styleUrls: ['./resizing-with-the-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-resizing-with-the-api-example', { title: 'Resizing With The Api' })
export class ResizingWithTheApiExample {

  columns = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', width: '15%' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', maxWidth: 120 }
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }

  resize(): void {
    const id = this.ds.hostGrid.columnApi.findColumn('id');
    this.ds.hostGrid.columnApi.resizeColumn(id, '200px');
  }
}
