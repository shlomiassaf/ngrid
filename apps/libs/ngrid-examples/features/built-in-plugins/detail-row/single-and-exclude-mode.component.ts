import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DemoDataSource } from '@pebula/apps/shared-data';
import { Example } from '@pebula/apps/shared';

@Component({
  selector: 'pbl-single-and-exclude-mode-example',
  templateUrl: './single-and-exclude-mode.component.html',
  styleUrls: ['./single-and-exclude-mode.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-single-and-exclude-mode-example', { title: 'Single And Exclude Mode' })
export class SingleAndExcludeModeExample {
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

  forceSingle: boolean;
  disableName: string[] = [];

  constructor(private datasource: DemoDataSource) { }
}
