import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pbl-drag-plugin-default-templates',
  template:
`<pbl-table-drag-resize *pblTableCellResizerRef="let ctx" [context]="ctx"></pbl-table-drag-resize>
<span *pblTableCellDraggerRef="let ctx" [negTableColumnDrag]="ctx" cdkDragRootElementClass="cdk-drag"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DragPluginDefaultTemplatesComponent {}
