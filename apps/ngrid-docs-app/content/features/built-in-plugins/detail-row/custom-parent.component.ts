import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-custom-parent-example',
  templateUrl: './custom-parent.component.html',
  styleUrls: ['./custom-parent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-custom-parent-example', { title: 'Custom Parent' })
export class CustomParentExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'detailRowHandle', label: ' ', type: 'detailRowHandle', minWidth: 48, maxWidth: 48 },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 4) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
