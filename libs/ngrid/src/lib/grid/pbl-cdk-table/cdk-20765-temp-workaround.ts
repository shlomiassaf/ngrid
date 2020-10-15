import { Injectable, IterableChangeRecord, IterableChanges, ViewContainerRef } from '@angular/core';
import { _DisposeViewRepeaterStrategy, _ViewRepeaterItemChange, _ViewRepeaterItemChanged, _ViewRepeaterItemContext, _ViewRepeaterItemContextFactory, _ViewRepeaterItemValueResolver, _ViewRepeaterOperation } from '@angular/cdk/collections';
import { CdkRowDef, RenderRow, BaseRowDef, RowContext, CdkTable } from '@angular/cdk/table';

import { PblNgridPluginController } from '../../ext/plugin-control';
import { PblNgridComponent } from '../ngrid.component';

/**
 *
 * @deprecated remove when and if PR https://github.com/angular/components/pull/20765 is accepted and the old version not supporting the solution is not supported by ngrid.
 */
@Injectable()
export class _TempDisposeViewRepeaterStrategy<T, R extends RenderRow<T>, C extends RowContext<T>> extends _DisposeViewRepeaterStrategy<T, R, C> {
  private workaroundEnabled = false;
  private renderer: { _renderCellTemplateForItem: (rowDef: BaseRowDef, context: RowContext<T>) => void; };
  private _cachedRenderDefMap = new Map<number, CdkRowDef<T>>();

  constructor(grid: PblNgridComponent<T>) {
    super();
    const pluginCtrl = PblNgridPluginController.find(grid);
    pluginCtrl.onInit()
      .subscribe(() => {
        const cdkTable = pluginCtrl.extApi.cdkTable;
        this.renderer = cdkTable as any;
        this.workaroundEnabled = !cdkTable['_cachedRenderDefMap'] && typeof this.renderer._renderCellTemplateForItem === 'function';
      });
  }

  applyChanges(changes: IterableChanges<R>,
               viewContainerRef: ViewContainerRef,
               itemContextFactory: _ViewRepeaterItemContextFactory<T, R, C>,
               itemValueResolver: _ViewRepeaterItemValueResolver<T, R>,
               itemViewChanged?: _ViewRepeaterItemChanged<R, C>): void {
    if (this.workaroundEnabled) {
      super.applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, (change: _ViewRepeaterItemChange<R, C>) => {
        itemViewChanged(change);
        switch (change.operation) {
          case _ViewRepeaterOperation.REPLACED:
          case _ViewRepeaterOperation.INSERTED:
          case _ViewRepeaterOperation.MOVED:
            this._cachedRenderDefMap.set(change.record.currentIndex!, change.record.item.rowDef);
            break;
          case _ViewRepeaterOperation.REMOVED:
            this._cachedRenderDefMap.delete(change.record.previousIndex!);
            break;
        }
      });

      changes.forEachIdentityChange = (fn: (record: IterableChangeRecord<R>) => void) => {
        changes.constructor.prototype.forEachIdentityChange.call(changes, (record: IterableChangeRecord<R>) => {
          fn(record);
          if (this._cachedRenderDefMap.get(record.currentIndex!) !== record.item.rowDef) {
            viewContainerRef.remove(record.currentIndex!);
            const insertContext = itemContextFactory(record, null, record.currentIndex);
            viewContainerRef.createEmbeddedView(insertContext.templateRef, insertContext.context, insertContext.index);
            this._cachedRenderDefMap.set(record.currentIndex!, record.item.rowDef);
            this.renderer._renderCellTemplateForItem(record.item.rowDef, insertContext.context!);
          }
        });
      }
    } else {
      super.applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, itemViewChanged);
    }

  }
}
