import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-copy-selection-example',
  templateUrl: './copy-selection.component.html',
  styleUrls: ['./copy-selection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-copy-selection-example', { title: 'Copy Selection' })
export class CopySelectionExample {
  columns = columnFactory()
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
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 500) ).create();

  hideColumns: string[] = [ 'bio' ];

  constructor(private datasource: DynamicClientApi) { }


}

