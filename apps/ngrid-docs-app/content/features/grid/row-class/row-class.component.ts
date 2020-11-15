import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridRowContext } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-row-class-example',
  templateUrl: './row-class.component.html',
  styleUrls: ['./row-class.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-row-class-example', { title: 'Row Class' })
export class RowClassExample {

  columns = columnFactory()
    .table(
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  rowClassUpdate = (context: PblNgridRowContext<Person>) => {
    if (context.$implicit.name.length > 14) {
      return 'row-class-name-length-gt-14';
    }
  };

  constructor(private datasource: DynamicClientApi) { }
}
