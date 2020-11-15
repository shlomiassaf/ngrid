import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS } from '@pebula/ngrid';
import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import { Example } from '@pebula/apps/docs-app-lib';

@Component({
  selector: 'pbl-enabling-custom-triggers-example-component',
  templateUrl: './enabling-custom-triggers.component.html',
  styleUrls: ['./enabling-custom-triggers.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-enabling-custom-triggers-example-component', { title: 'Enabling custom triggers' })
export class EnablingCustomTriggersExample {

  columns = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

  dsCustomTrigger = createDS<Person>()
    .setCustomTriggers('pagination', 'sort')
    .onTrigger( event => {
      if (event.pagination.changed || event.isInitial) {
        event.updateTotalLength(500);
        return this.datasource.getPeople(0, 500).then( results => {
          const page = event.pagination.page.curr;
          const perPage = event.pagination.perPage.curr;
          return results.slice( (page - 1) * perPage, (page - 1) * perPage + perPage);
        });
      }
      return false;
    })
    .create();

  constructor(private datasource: DynamicClientApi) { }

}
