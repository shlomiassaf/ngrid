import { Inject, Injectable, IterableChangeRecord, IterableChanges, ViewContainerRef } from '@angular/core';
import { _DisposeViewRepeaterStrategy, _ViewRepeaterItemChange, _ViewRepeaterItemChanged, _ViewRepeaterItemContext, _ViewRepeaterItemContextFactory, _ViewRepeaterItemValueResolver, _ViewRepeaterOperation } from '@angular/cdk/collections';
import { CdkRowDef, RenderRow, BaseRowDef, RowContext, CdkTable, CdkCellOutlet } from '@angular/cdk/table';

import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

/**
 *
 * @deprecated remove when and if PR https://github.com/angular/components/pull/20765 is accepted and the old version not supporting the solution is not supported by ngrid.
 */
@Injectable()
export class _TempDisposeViewRepeaterStrategy<T, R extends RenderRow<T>, C extends RowContext<T>> extends _DisposeViewRepeaterStrategy<T, R, C> {
  private workaroundEnabled = false;
  private renderer: { _renderCellTemplateForItem: (rowDef: BaseRowDef, context: RowContext<T>) => void; };
  private _cachedRenderDefMap = new Map<number, CdkRowDef<T>>();

  constructor(@Inject(EXT_API_TOKEN) extApi: PblNgridInternalExtensionApi<T>) {
    super();
    extApi.pluginCtrl.onInit()
      .subscribe(() => {
        const cdkTable = extApi.cdkTable;
        this.renderer = cdkTable as any;
        this.workaroundEnabled = !cdkTable['_cachedRenderDefMap'] && typeof this.renderer._renderCellTemplateForItem === 'function';
      });
  }

  applyChanges(changes: IterableChanges<R>,
               viewContainerRef: ViewContainerRef,
               itemContextFactory: _ViewRepeaterItemContextFactory<T, R, C>,
               itemValueResolver: _ViewRepeaterItemValueResolver<T, R>,
               itemViewChanged?: _ViewRepeaterItemChanged<R, C>): void {
    super.applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, (change: _ViewRepeaterItemChange<R, C>) => {
      if (this.workaroundEnabled) {
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
      }
    });

    if (this.workaroundEnabled) {
      changes.forEachIdentityChange = (fn: (record: IterableChangeRecord<R>) => void) => {
        changes.constructor.prototype.forEachIdentityChange.call(changes, (record: IterableChangeRecord<R>) => {
          fn(record);
          if (this._cachedRenderDefMap.get(record.currentIndex!) !== record.item.rowDef) {
            viewContainerRef.remove(record.currentIndex!);
            const insertContext = itemContextFactory(record, null, record.currentIndex);
            viewContainerRef.createEmbeddedView(insertContext.templateRef, insertContext.context, insertContext.index);
            this._cachedRenderDefMap.set(record.currentIndex!, record.item.rowDef);
          }
        });
      }
    }
  }
}
