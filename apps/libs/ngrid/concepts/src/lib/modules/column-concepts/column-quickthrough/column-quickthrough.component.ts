import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pbl-column-quickthrough-grid-example-component',
  templateUrl: './column-quickthrough.component.html',
  styleUrls: ['./column-quickthrough.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnQuickthroughGridExampleComponent {
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
          { prop: 'id' },
          { prop: 'name', span: 1, label: 'Header Group: Name & Age', css: 'col-quickthrough-bg-group' },
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
}
