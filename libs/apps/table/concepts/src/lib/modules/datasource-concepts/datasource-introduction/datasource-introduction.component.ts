/* @neg-example:ex-1 ex-2 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS } from '@neg/table';
import { Person, DemoDataSource } from '@neg/apps/table/shared';

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

  /* @neg-ignore:ex-2 */
  ds = [ { id: 10, name: 'John Doe', email: 'john.doe@anonymous.com' }];
  /* @neg-ignore:ex-2 */
  /* @neg-ignore:ex-1 */
  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();
  /* @neg-ignore:ex-1 */

  /* @neg-ignore:ex-1 */
  constructor(private datasource: DemoDataSource) { }
  /* @neg-ignore:ex-1 */
}
/* @neg-example:ex-1 ex-2 */
