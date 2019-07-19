import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory  } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-cell-edit-directives-example',
  templateUrl: './cell-edit-directives.component.html',
  styleUrls: ['./cell-edit-directives.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-cell-edit-directives-example', { title: 'Cell Edit Directives' })
export class CellEditDirectivesExample {
  columns = columnFactory()
  .table(
    { prop: 'id', width: '40px' },
    { prop: 'name' },
    { prop: 'gender', width: '50px' },
    { prop: 'birthdate', type: 'date', editable: true },
  )
  .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DemoDataSource) { }
}
