import { EmbeddedViewRef, Injectable, IterableChangeRecord } from '@angular/core';
import { _ViewRepeaterItemInsertArgs, _ViewRepeaterOperation } from '@angular/cdk/collections';
import { RenderRow } from '@angular/cdk/table';

import { ChangeOperationState, PblNgridBaseRowViewRepeaterStrategy } from './ngrid-base-row-view-repeater-strategy';
import { PblRowContext } from '../context/row';

@Injectable()
export class PblNgridDisposedRowViewRepeaterStrategy<T, R extends RenderRow<T>, C extends PblRowContext<T>> extends PblNgridBaseRowViewRepeaterStrategy<T, R, C> {

  protected addItem(adjustedPreviousIndex: number | null, currentIndex: number | null, state: ChangeOperationState<T, R, C>) {
    state.view = state.createEmbeddedView(state.record, adjustedPreviousIndex, currentIndex);
    state.op = _ViewRepeaterOperation.INSERTED;
  }

  protected removeItem(removeAt: number, state: ChangeOperationState<T, R, C>) {
    state.vcRef.remove(removeAt);
    state.op = _ViewRepeaterOperation.REMOVED;
  }

  protected moveItem(moveFrom: number, moveTo: number, state: ChangeOperationState<T, R, C>) {
    state.view = state.vcRef.get(moveFrom) as EmbeddedViewRef<C>;
    state.vcRef.move(state.view, moveTo);
    state.op = _ViewRepeaterOperation.MOVED;
  }

}
