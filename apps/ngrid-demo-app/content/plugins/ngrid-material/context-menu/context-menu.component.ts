import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-context-menu-example',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-context-menu-example', { title: 'Context Menu: Excel Style Header' })
export class ContextMenuExample {
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
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 100) ).create();

  constructor(private datasource: DemoDataSource) { }
}
