import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pbl-datasource-quickthrough-grid-example-component',
  templateUrl: './datasource-quickthrough.component.html',
  styleUrls: ['./datasource-quickthrough.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasourceQuickthroughGridExampleComponent { }
