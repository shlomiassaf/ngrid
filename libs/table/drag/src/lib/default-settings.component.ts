import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pbl-drag-plugin-default-templates',
  template:
`<pbl-table-drag-resize *negTableCellResizerRef="let ctx" [context]="ctx"></pbl-table-drag-resize>
<span *negTableCellDraggerRef="let ctx" [negTableColumnDrag]="ctx" cdkDragRootElementClass="cdk-drag"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DragPluginDefaultTemplatesComponent {}
