import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-checkbox-color-example',
  templateUrl: './checkbox-color.component.html',
  styleUrls: ['./checkbox-color.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-checkbox-color-example', { title: 'CheckBox Color' })
export class CheckboxColorExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'selection', width: '48px' },
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

  constructor(private datasource: DemoDataSource) { }
}
