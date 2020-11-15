import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS } from '@pebula/ngrid';
import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-working-with-pbl-datasource-example',
  templateUrl: './working-with-pbl-datasource.component.html',
  styleUrls: ['./working-with-pbl-datasource.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-working-with-pbl-datasource-example', { title: 'Working with PblDataSource' })
export class WorkingWithPblDataSourceExample {

  columns = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  constructor(private datasource: DynamicClientApi) { }
}
