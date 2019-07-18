import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-max-column-width-example-component',
  templateUrl: './max-column-width.component.html',
  styleUrls: ['./max-column-width.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-max-column-width-example-component', { title: 'Maximum Column Width' })
export class MaxColumnWidthFeatureExample {

  columns = columnFactory()
    .default({ resize: true })
    .table(
      { prop: 'name' },
      { prop: 'gender', maxWidth: 50 },
      { prop: 'birthdate', type: 'date', maxWidth: 100 },
      { prop: 'bio', maxWidth: 500 },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 5) ).create();

  constructor(private datasource: DemoDataSource) { }
}
