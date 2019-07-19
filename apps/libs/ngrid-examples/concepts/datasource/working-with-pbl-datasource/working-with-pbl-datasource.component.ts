import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

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
  constructor(private datasource: DemoDataSource) { }
}
