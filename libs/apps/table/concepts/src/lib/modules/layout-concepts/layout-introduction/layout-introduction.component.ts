/* @neg-example:ex-1 ex-2 ex-3 ex-4 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@neg/table';
import { Person, DemoDataSource } from '@neg/apps/table/shared';

@Component({
  selector: 'neg-layout-introduction-table-example-component',
  templateUrl: './layout-introduction.component.html',
  styleUrls: ['./layout-introduction.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutIntroductionTableExampleComponent {

  columns = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 2) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @neg-example:ex-1 ex-2 ex-3 ex-4 */
