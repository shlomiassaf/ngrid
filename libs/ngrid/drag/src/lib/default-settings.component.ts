import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pbl-drag-plugin-default-templates',
  template:
`<pbl-ngrid-drag-resize *pblNgridCellResizerRef="let ctx" [context]="ctx"></pbl-ngrid-drag-resize>
<span *pblNgridCellDraggerRef="let ctx" [pblNgridColumnDrag]="ctx.col" cdkDragRootElementClass="cdk-drag"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DragPluginDefaultTemplatesComponent {}
