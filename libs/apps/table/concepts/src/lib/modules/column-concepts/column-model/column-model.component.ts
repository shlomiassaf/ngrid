/* @pebula-example:ex-1 ex-2 ex-3 ex-4 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/table';
import { Person, DemoDataSource } from '@pebula/apps/table/shared';

@Component({
  selector: 'neg-column-model-table-example-component',
  templateUrl: './column-model.component.html',
  styleUrls: ['./column-model.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnModelTableExampleComponent {

  columnsSimpleModel = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };
  /* @pebula-ignore:ex-1 */
  columnsSimpleModel2 = columnFactory()
    .table(
      { prop: '__', type: 'dataRow', headerType: 'dataRow', footerType: 'dataRow', width: '160px' },
    )
    .build();

  columnsWithMeta = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email' },
    )
    .header(
      { id: 'header', label: 'Header Column Cell' },
    )
    .headerGroup(
      { prop: 'name', span: 1, label: 'Group Column Cell' },
    )
    .footer(
      { id: 'footer', label: 'Footer Column Cell' },
    )
    .build();

  columnsWithMeta2 = columnFactory()
    .table(
      { prop: '__', type: 'dataRow', headerType: 'dataRow', footerType: 'dataRow', width: '160px' },
    )
    .header(
      { id: '__meta', width: '160px', type: 'metaRow', label: 'HEADER' },
    )
    .headerGroup(
      { prop: '__', span: 0, type: 'metaRow', label: 'GROUP' },
    )
    .footer(
      { id: '__meta2', width: '160px', type: 'metaRow', label: 'FOOTER' },
    )
    .build();
  /* @pebula-ignore:ex-1 */

  dsSimpleModel = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 1) ).create();

  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 3) ).create();

  constructor(private datasource: DemoDataSource) { }
}
/* @pebula-example:ex-1 ex-2 ex-3 ex-4 */
