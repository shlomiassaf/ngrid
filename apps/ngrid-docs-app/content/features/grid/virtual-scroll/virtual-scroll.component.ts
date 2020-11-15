import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';

import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-virtual-scroll-example',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-virtual-scroll-example', { title: 'Virtual Scroll' })
export class VirtualScrollExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = this.createDatasource();

  constructor(private datasource: DynamicClientApi) { }

  removeDatasource(): void {
    if (this.ds) {
      this.ds.dispose();
      this.ds = undefined;
    }
  }

  createDatasource() {
    return createDS<Person>()
      .onTrigger( () => this.datasource.getPeople(0, 1500) )
      .create();
  }
}
