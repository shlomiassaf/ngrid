import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-transpose-example',
  templateUrl: './transpose.component.html',
  styleUrls: ['./transpose.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-transpose-example', { title: 'Transpose' })
export class TransposeExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: { name: 'date', data: { format: 'dd MMM, yyyy' } } },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  transposeToggle = false;

  constructor(private datasource: DynamicClientApi) { }
}
