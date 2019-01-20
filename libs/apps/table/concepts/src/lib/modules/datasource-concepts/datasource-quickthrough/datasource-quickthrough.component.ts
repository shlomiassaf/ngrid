import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'neg-datasource-quickthrough-table-example-component',
  templateUrl: './datasource-quickthrough.component.html',
  styleUrls: ['./datasource-quickthrough.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasourceQuickthroughTableExampleComponent { }
