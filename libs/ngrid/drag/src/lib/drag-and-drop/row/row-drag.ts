import { Directive, Input, OnInit } from '@angular/core';
import { DragDrop, CdkDragStart, CDK_DRAG_PARENT } from '@angular/cdk/drag-drop';

import { PblNgridPluginController, PblNgridCellContext } from '@pebula/ngrid';
import { PblDragDrop, CdkLazyDrag } from '../core/index';
import { PblNgridRowReorderPluginDirective, ROW_REORDER_PLUGIN_KEY } from './row-reorder-plugin';

@Directive({
  selector: '[pblNgridRowDrag]',
  exportAs: 'pblNgridRowDrag',
  host: { // tslint:disable-line:no-host-metadata-property
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DRAG_PARENT, useExisting: PblNgridRowDragDirective },
  ]
})
export class PblNgridRowDragDirective<T = any> extends CdkLazyDrag<T, PblNgridRowReorderPluginDirective<T>> implements OnInit {
  rootElementSelector = 'pbl-ngrid-row';

  get context(): PblNgridCellContext<T> {
    return this._context;
  }

  @Input('pblNgridRowDrag') set context(value: PblNgridCellContext<T>) {
    this._context = value;

    const pluginCtrl = this.pluginCtrl = value && PblNgridPluginController.find(value.grid);
    const plugin = pluginCtrl?.getPlugin(ROW_REORDER_PLUGIN_KEY);
    this.cdkDropList = plugin || undefined;
  }

  /**
   * Reference to the last dragged context.
   *
   * This context is not similar to the `context` property.
   * The `context` property holds the current context which is shared and updated on scroll so if a user start a drag and then scrolled
   * the context will point to the row in view and not the original cell.
   */
  get draggedContext(): Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>> {
    return this._draggedContext;
  }

  private _context: PblNgridCellContext<T>;
  private _draggedContext: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>;

  private pluginCtrl: PblNgridPluginController;

  ngOnInit(): void {
    this.started.subscribe( (event: CdkDragStart) => {
      const { col, row, grid, value }  = this._context;
      this._draggedContext = { col, row, grid, value };
    });
    super.ngOnInit();
  }
}
