import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'neg-column-templates-table-example-component',
  templateUrl: './column-templates.component.html',
  styleUrls: ['./column-templates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnTemplatesTableExampleComponent {}
