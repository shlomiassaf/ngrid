import { Directive, Input } from '@angular/core';
import { DragDrop, CdkDragStart, CDK_DRAG_PARENT } from '@angular/cdk/drag-drop';

import { PblNgridPluginController, PblNgridCellContext } from '@pebula/ngrid';
import { PblDragDrop, CdkLazyDrag } from '../core/index';
import { PblNgridRowReorderPluginDirective, ROW_REORDER_PLUGIN_KEY } from './row-reorder-plugin';

@Directive({
  selector: '[pblNgridRowDrag]',
  exportAs: 'pblNgridRowDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DRAG_PARENT, useExisting: PblNgridRowDragDirective },
  ]
})
export class PblNgridRowDragDirective<T = any> extends CdkLazyDrag<T, PblNgridRowReorderPluginDirective<T>> {
  rootElementSelector = 'pbl-ngrid-row';

  get context(): Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>> {
    return this._context;
  }

  @Input('pblNgridRowDrag') set context(value: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>) {
    this._context = value;

    const pluginCtrl = this.pluginCtrl = value && PblNgridPluginController.find(value.grid);
    const plugin = pluginCtrl && pluginCtrl.getPlugin(ROW_REORDER_PLUGIN_KEY);
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

  private _context: Pick<PblNgridCellContext<T>, 'col' | 'grid'> & Partial<Pick<PblNgridCellContext<T>, 'row' | 'value'>>;
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
