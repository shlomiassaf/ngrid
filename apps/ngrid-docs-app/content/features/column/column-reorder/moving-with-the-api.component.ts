import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridComponent } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-moving-with-the-api-example',
  templateUrl: './moving-with-the-api.component.html',
  styleUrls: ['./moving-with-the-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-moving-with-the-api-example', { title: 'Moving With The Api' })
export class MovingWithTheApiExample {

  columns = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'language', width: '120px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }

  move(table: PblNgridComponent<Person>): void {
    const id = table.columnApi.findColumn('id');
    const gender = table.columnApi.findColumn('gender');
    table.columnApi.moveColumn(id, gender);
  }

  swap(table: PblNgridComponent<Person>): void {
    const name = table.columnApi.findColumn('name');
    const birthdate = table.columnApi.findColumn('birthdate');
    table.columnApi.swapColumns(name, birthdate);
  }

}
