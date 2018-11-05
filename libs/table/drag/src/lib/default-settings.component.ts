import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'neg-drag-plugin-default-templates',
  template:
`<neg-table-drag-resize *negTableCellResizerRef="let ctx" [context]="ctx"></neg-table-drag-resize>
<span *negTableCellDraggerRef="let ctx" [negTableColumnDrag]="ctx"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DragPluginDefaultTemplatesComponent {}
