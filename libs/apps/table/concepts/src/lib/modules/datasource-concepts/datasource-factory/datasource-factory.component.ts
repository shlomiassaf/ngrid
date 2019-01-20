// tslint:disable:member-ordering
/* @neg-example:ex-1 ex-2 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS } from '@neg/table';
import { Person, DemoDataSource } from '@neg/apps/table/shared';

@Component({
  selector: 'neg-datasource-factory-table-example-component',
  templateUrl: './datasource-factory.component.html',
  styleUrls: ['./datasource-factory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasourceFactoryTableExampleComponent {

  columns = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

  /* @neg-ignore:ex-2 */
  dsManualTrigger = createDS<Person, number>()
    .onTrigger( event => this.datasource.getPeople(0, event.data.curr || event.data.prev || 0) )
    .create();

  refresh(rowCount: number): void {
    this.dsManualTrigger.refresh(rowCount)
  }
  /* @neg-ignore:ex-2 */

  /* @neg-ignore:ex-1 */
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
  /* @neg-ignore:ex-1 */

  constructor(private datasource: DemoDataSource) { }

}
/* @neg-example:ex-1 ex-2 */
