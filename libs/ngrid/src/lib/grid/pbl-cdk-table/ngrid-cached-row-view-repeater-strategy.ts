import { EmbeddedViewRef, Injectable, ViewContainerRef } from '@angular/core';
import { _ViewRepeaterItemInsertArgs, _ViewRepeaterOperation } from '@angular/cdk/collections';
import { RenderRow } from '@angular/cdk/table';

import { ChangeOperationState, PblNgridBaseRowViewRepeaterStrategy } from './ngrid-base-row-view-repeater-strategy';
import { PblRowContext } from '../context/row';

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
export class PblNgridCachedRowViewRepeaterStrategy<T, R extends RenderRow<T>, C extends PblRowContext<T>> extends PblNgridBaseRowViewRepeaterStrategy<T, R, C> {

  /**
   * The size of the cache used to store unused views.
   * Setting the cache size to `0` will disable caching. Defaults to 20 views.
   */
  viewCacheSize = 20;

  /**
   * View cache that stores embedded view instances that have been previously stamped out,
   * but don't are not currently rendered. The view repeater will reuse these views rather than
   * creating brand new ones.
   */
  private _viewCache: EmbeddedViewRef<C>[] = [];

  detach(): void {
    for (const view of this._viewCache) {
      view.destroy();
    }
  }


  protected addItem(adjustedPreviousIndex: number | null, currentIndex: number | null, state: ChangeOperationState<T, R, C>) {
     /* Inserts a view for a new item, either from the cache or by creating a new one.
        Returns `undefined` if the item was inserted into a cached view. */
    state.view = this._insertViewFromCache(currentIndex, state.vcRef);
    if (state.view) {
      state.view.context.$implicit = state.itemValueResolver(state.record);
      state.op = _ViewRepeaterOperation.REPLACED;
    } else {
      state.view = state.createEmbeddedView(state.record, adjustedPreviousIndex, currentIndex);
      state.op = _ViewRepeaterOperation.INSERTED;
    }
  }

  protected removeItem(removeAt: number, state: ChangeOperationState<T, R, C>) {
      /** Detaches the view at the given index and inserts into the view cache. */
    const detachedView = this._detachView(removeAt, state.vcRef);
    this._maybeCacheView(detachedView, state.vcRef);
    state.op = _ViewRepeaterOperation.REMOVED;
  }

  protected moveItem(moveFrom: number, moveTo: number, state: ChangeOperationState<T, R, C>) {
    state.view = state.vcRef.get(moveFrom) as EmbeddedViewRef<C>;
    state.vcRef.move(state.view, moveTo);
    state.view.context.$implicit = state.itemValueResolver(state.record);
    state.op = _ViewRepeaterOperation.MOVED;
  }


  /**
   * Cache the given detached view. If the cache is full, the view will be
   * destroyed.
   */
  private _maybeCacheView(view: EmbeddedViewRef<C>, viewContainerRef: ViewContainerRef) {
    if (this._viewCache.length < this.viewCacheSize) {
      this._viewCache.push(view);
      this.extApi.rowsApi.findRowByElement(view.rootNodes[0])._detach();
      // Notify this row is not part of the view, its cached (however, the component and any child component is not destroyed)
    } else {
      const index = viewContainerRef.indexOf(view);

      // The host component could remove views from the container outside of
      // the view repeater. It's unlikely this will occur, but just in case,
      // destroy the view on its own, otherwise destroy it through the
      // container to ensure that all the references are removed.
      if (index === -1) {
        view.destroy();
      } else {
        viewContainerRef.remove(index);
      }
    }
  }

  /** Inserts a recycled view from the cache at the given index. */
  private _insertViewFromCache(index: number, viewContainerRef: ViewContainerRef): EmbeddedViewRef<C> | null {
    const cachedView = this._viewCache.pop();
    if (cachedView) {
      // Notify that the items is not longer cached, now live and playing the game
      this.extApi.rowsApi.findRowByElement(cachedView.rootNodes[0])._attach();
      viewContainerRef.insert(cachedView, index);
    }
    return cachedView || null;
  }

  /** Detaches the embedded view at the given index. */
  private _detachView(index: number, viewContainerRef: ViewContainerRef): EmbeddedViewRef<C> {
    return viewContainerRef.detach(index) as EmbeddedViewRef<C>;
  }
}
