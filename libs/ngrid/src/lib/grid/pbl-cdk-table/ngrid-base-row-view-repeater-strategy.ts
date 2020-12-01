import { EmbeddedViewRef, Inject, Injectable, IterableChangeRecord, IterableChanges, ViewContainerRef } from '@angular/core';
import {
  _ViewRepeater,
  _ViewRepeaterItemChange,
  _ViewRepeaterItemChanged,
  _ViewRepeaterItemContext,
  _ViewRepeaterItemContextFactory,
  _ViewRepeaterItemInsertArgs,
  _ViewRepeaterItemValueResolver,
  _ViewRepeaterOperation,
} from '@angular/cdk/collections';
import { CdkRowDef, RenderRow, BaseRowDef, RowContext } from '@angular/cdk/table';

import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { PblRowContext } from '../context/row';
import { rowContextBridge } from '../row/row-to-repeater-bridge';

export interface BaseChangeOperationState<T, R extends RenderRow<T>, C extends PblRowContext<T>> {
  vcRef: ViewContainerRef;
  createEmbeddedView: (record: IterableChangeRecord<R>, adjustedPreviousIndex: number | null, currentIndex: number | null) => EmbeddedViewRef<C>;
  itemValueResolver: _ViewRepeaterItemValueResolver<T, R>;
}

export interface ChangeOperationState<T, R extends RenderRow<T>, C extends PblRowContext<T>> extends BaseChangeOperationState<T, R, C> {
  record: IterableChangeRecord<R>;
  view?: EmbeddedViewRef<C> | undefined;
  op?: _ViewRepeaterOperation;
}

@Injectable()
export class PblNgridBaseRowViewRepeaterStrategy<T, R extends RenderRow<T>, C extends PblRowContext<T>> implements _ViewRepeater<T, R, C> {
  protected workaroundEnabled = false;
  protected renderer: { _renderCellTemplateForItem: (rowDef: BaseRowDef, context: RowContext<T>) => void; };
  protected _cachedRenderDefMap = new Map<number, CdkRowDef<T>>();

  constructor(@Inject(EXT_API_TOKEN) protected extApi: PblNgridInternalExtensionApi<T>) {
    extApi
      .onConstructed(() => {
        const cdkTable = extApi.cdkTable;
        this.renderer = cdkTable as any;
        this.workaroundEnabled = !cdkTable['_cachedRenderDefMap'] && typeof this.renderer._renderCellTemplateForItem === 'function';
      });
  }

  applyChanges(changes: IterableChanges<R>,
               vcRef: ViewContainerRef,
               itemContextFactory: _ViewRepeaterItemContextFactory<T, R, C>,
               itemValueResolver: _ViewRepeaterItemValueResolver<T, R>,
               itemViewChanged?: _ViewRepeaterItemChanged<R, C>) {

    const createEmbeddedView = (record: IterableChangeRecord<R>,
                                adjustedPreviousIndex: number | null,
                                currentIndex: number | null) => {
      const itemArgs = itemContextFactory(record, adjustedPreviousIndex, currentIndex);
      itemArgs.context = this.extApi.contextApi._createRowContext(itemArgs.context.$implicit, itemArgs.index) as any;
      return rowContextBridge.bridgeContext<C>(itemArgs, () => vcRef.createEmbeddedView(itemArgs.templateRef, itemArgs.context, itemArgs.index));
    };

    const baseState: BaseChangeOperationState<T, R, C> = { vcRef, createEmbeddedView, itemValueResolver };
    changes.forEachOperation((record: IterableChangeRecord<R>, adjustedPreviousIndex: number | null, currentIndex: number | null) => {
      const state: ChangeOperationState<T, R, C> = Object.create(baseState);
      state.record = record;
      if (record.previousIndex == null) {
        this.addItem(adjustedPreviousIndex, currentIndex, state);
        if (state.op === _ViewRepeaterOperation.INSERTED) {

        }
      } else if (currentIndex == null) {
        this.removeItem(adjustedPreviousIndex, state);
      } else {
        this.moveItem(adjustedPreviousIndex, currentIndex, state);
      }

      if (this.workaroundEnabled) {
        this.patch20765afterOp(state);
      }

      this.afterOperation(state);
    });

    if (this.workaroundEnabled) {
      this.patch20765(changes, baseState);
    }
  }

  detach(): void { }

  protected addItem(adjustedPreviousIndex: number | null, currentIndex: number | null, state: ChangeOperationState<T, R, C>) { }

  protected removeItem(removeAt: number, state: ChangeOperationState<T, R, C>) { }

  protected moveItem(moveFrom: number, moveTo: number, state: ChangeOperationState<T, R, C>) { }

  protected afterOperation(state: ChangeOperationState<T, R, C>) {  }

  // See https://github.com/angular/components/pull/20765
  protected patch20765(changes: IterableChanges<R>, baseState: BaseChangeOperationState<T, R, C>) {
    changes.forEachIdentityChange = (fn: (record: IterableChangeRecord<R>) => void) => {
      changes.constructor.prototype.forEachIdentityChange.call(changes, (record: IterableChangeRecord<R>) => {
        fn(record);
        if (this._cachedRenderDefMap.get(record.currentIndex) !== record.item.rowDef) {
          baseState.vcRef.remove(record.currentIndex);
          baseState.createEmbeddedView(record, null, record.currentIndex);
          this._cachedRenderDefMap.set(record.currentIndex, record.item.rowDef);
        }
      });
    }
  }

  protected patch20765afterOp(state: ChangeOperationState<T, R, C>) {
    switch (state.op) {
      case _ViewRepeaterOperation.REPLACED:
      case _ViewRepeaterOperation.INSERTED:
      case _ViewRepeaterOperation.MOVED:
        this._cachedRenderDefMap.set(state.record.currentIndex, state.record.item.rowDef);
        break;
      case _ViewRepeaterOperation.REMOVED:
        this._cachedRenderDefMap.delete(state.record.previousIndex);
        break;
    }
  }

}
