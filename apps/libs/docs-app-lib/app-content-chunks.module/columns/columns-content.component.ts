import { Input, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Person, DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';

@Component({
  selector: 'pbl-columns-app-content-chunk',
  templateUrl: './columns-content.component.html',
  styleUrls: ['./columns-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsAppContentChunk {

  @Input() section: number;

  columns = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name', css: 'col-quickthrough-bg-data' },
        { prop: 'age' }
      ],
    },
    header: [
      {
        rowIndex: 0,
        cols: [
          { id: 'h1', label: 'Meta Header 1' },
          { id: 'h2', label: 'Meta Header 2', css: 'col-quickthrough-bg-header' },
          { id: 'h3', label: 'Meta Header 3' },
        ]
      }
    ],
    headerGroup: [
      {
        rowIndex: 1,
        cols: [
          { columnIds: ['id'] },
          { columnIds: ['name', 'age'], label: 'Header Group: Name & Age', css: 'col-quickthrough-bg-group' },
        ]
      }
    ],
    footer: [
      {
        rowIndex: 0,
        cols: [
          { id: 'f1' },
          { id: 'f2', label: 'Meta Footer 2', css: 'col-quickthrough-bg-footer', width: '50%' },
          { id: 'f3' },
        ]
      }
    ],
  };

  columnsSimpleModel = {
    table: {
      cols: [
        { prop: 'id' },
        { prop: 'name' },
        { prop: 'email' },
      ],
    },
  };

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
      { columnIds: ['name', 'gender'], label: 'Group Column Cell' },
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
      { columnIds: ['__'], type: 'metaRow', label: 'GROUP' },
    )
    .footer(
      { id: '__meta2', width: '160px', type: 'metaRow', label: 'FOOTER' },
    )
    .build();

  dsSimpleModel = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 1) ).create();

  ds2 = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 3) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
