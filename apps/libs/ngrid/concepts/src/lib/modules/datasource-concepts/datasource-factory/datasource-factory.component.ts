// tslint:disable:member-ordering
/* @pebula-example:ex-1 ex-2 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS } from '@pebula/ngrid';
import { Person, DemoDataSource } from '@pebula/apps/ngrid/shared';

@Component({
  selector: 'pbl-datasource-factory-grid-example-component',
  templateUrl: './datasource-factory.component.html',
  styleUrls: ['./datasource-factory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasourceFactoryGridExampleComponent {

  columns = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

  /* @pebula-ignore:ex-2 */
  dsManualTrigger = createDS<Person, number>()
    .onTrigger( event => this.datasource.getPeople(0, event.data.curr || event.data.prev || 0) )
    .create();

  refresh(rowCount: number): void {
    this.dsManualTrigger.refresh(rowCount)
  }
  /* @pebula-ignore:ex-2 */

  /* @pebula-ignore:ex-1 */
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
  /* @pebula-ignore:ex-1 */

  constructor(private datasource: DemoDataSource) { }

}
/* @pebula-example:ex-1 ex-2 */
