import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'pbl-column-templates-grid-example-component',
  templateUrl: './column-templates.component.html',
  styleUrls: ['./column-templates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnTemplatesGridExampleComponent {}
