/* @pebula-example:ex-1 ex-2 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS } from '@pebula/table';
import { Person, DemoDataSource } from '@pebula/apps/table/shared';

@Component({
  selector: 'neg-datasource-introduction-table-example-component',
  templateUrl: './datasource-introduction.component.html',
  styleUrls: ['./datasource-introduction.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasourceIntroductionlTableExampleComponent {

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
  ds = [ { id: 10, name: 'John Doe', email: 'john.doe@anonymous.com' }];
  /* @pebula-ignore:ex-2 */
  /* @pebula-ignore:ex-1 */
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @pebula-ignore:ex-1 */

  /* @pebula-ignore:ex-1 */
  constructor(private datasource: DemoDataSource) { }
  /* @pebula-ignore:ex-1 */
}
/* @pebula-example:ex-1 ex-2 */
