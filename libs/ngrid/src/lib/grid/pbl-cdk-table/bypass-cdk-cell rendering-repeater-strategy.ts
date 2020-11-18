import { Inject, Injectable, IterableChangeRecord, IterableChanges, ViewContainerRef } from '@angular/core';
import { _DisposeViewRepeaterStrategy, _ViewRepeaterItemChange, _ViewRepeaterItemChanged, _ViewRepeaterItemContext, _ViewRepeaterItemContextFactory, _ViewRepeaterItemValueResolver, _ViewRepeaterOperation } from '@angular/cdk/collections';
import { CdkRowDef, RenderRow, BaseRowDef, RowContext } from '@angular/cdk/table';

import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

/**
 * This is a noop strategy that simply prevents the CDK from rendering cells for each row and instead the logic for it is now
 * handled within the row itself.
 *
 * This is very powerful and eliminate the need to use column declaration in strings.
 * Since we have a column store we can take it directly from there.
 *
 * Additionally, a temp fix for a bug is applied (see `workaroundEnabled`
 * Remove when and if PR https://github.com/angular/components/pull/20765 is accepted and the old version not supporting the solution is not supported by ngrid.
 */
@Injectable()
export class BypassCellRenderDisposeViewRepeaterStrategy<T, R extends RenderRow<T>, C extends RowContext<T>> extends _DisposeViewRepeaterStrategy<T, R, C> {
  private workaroundEnabled = false;
  private renderer: { _renderCellTemplateForItem: (rowDef: BaseRowDef, context: RowContext<T>) => void; };
  private _cachedRenderDefMap = new Map<number, CdkRowDef<T>>();

  constructor(@Inject(EXT_API_TOKEN) private extApi: PblNgridInternalExtensionApi<T>) {
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
               __itemContextFactory: _ViewRepeaterItemContextFactory<T, R, C>,
               itemValueResolver: _ViewRepeaterItemValueResolver<T, R>,
               __itemViewChanged?: _ViewRepeaterItemChanged<R, C>): void {

    const itemContextFactory: _ViewRepeaterItemContextFactory<T, R, C> = (record: IterableChangeRecord<R>, adjustedPreviousIndex: number | null, currentIndex: number | null) => {
      const insertArgs = __itemContextFactory(record, adjustedPreviousIndex, currentIndex);
      insertArgs.context = this.extApi.contextApi._createRowContext(record.item.data, currentIndex) as any;
      return insertArgs;
    }

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
