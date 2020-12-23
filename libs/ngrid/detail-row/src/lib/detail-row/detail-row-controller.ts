import { EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { PblNgridExtensionApi } from '@pebula/ngrid';
import { PblNgridDetailRowContext, PblNgridDetailRowDefDirective } from './directives';
import { PblNgridDetailRowComponent } from './row';

const NOOP = () => {};

interface DetailRowViewState {
  viewRef: EmbeddedViewRef<PblNgridDetailRowContext>
}

interface PendingOperation {
  type: 'render' | 'clear';
  fromRender: boolean;
}

/**
 * In charge of handling the lifecycle of detail row instances.
 * The whole lifecycle: Create, update, move, destroy, etc...
 *
 * This controller also sync's the rendering process to make sure we reuse detail rom elements within
 * a single rendering cycle (i.e. not long term caching but a short term one).
 * This is done for performance and to prevent flickering when a row is moved into a different element due to virtual scroll.
 * When this happen we just want to move all dom elements properly, swap the context and trigger change detection.
 * If we have left over rows to render we create new elements or if we have left over rows to clear, we remove them.
 * The logic for this relay on the fact that the row's context.$implicit is updated in a sync iteration by the cdk table
 * and afterwards we will have the onRenderRows event fired, allowing us to sync changes.
 * We also relay on the fact that the event run immediately after the iterations and everything is sync.
 *
 * > In the future, this is where we can support detail row caching
 */
export class DetailRowController {

  private viewMap = new Map<PblNgridDetailRowComponent, DetailRowViewState>();
  private pendingOps = new Map<PblNgridDetailRowComponent, PendingOperation>();
  private deferOps = false;
  private detailRowDef: PblNgridDetailRowDefDirective;

  private runMeasure = () => this.extApi.grid.viewport.reMeasureCurrentRenderedContent();

  constructor(private readonly vcRef: ViewContainerRef,
              private readonly extApi: PblNgridExtensionApi) {
    extApi.onInit(() => {
      this.detailRowDef = extApi.grid.registry.getSingle('detailRow');
      extApi.cdkTable.beforeRenderRows.subscribe(() => this.deferOps = true );
      extApi.cdkTable.onRenderRows.subscribe(() => this.flushPendingOps());
    });

    extApi.grid.registry.changes
      .subscribe( changes => {
        for (const c of changes) {
          switch (c.type) {
            case 'detailRow':
              if (c.op === 'remove') {
                this.detailRowDef = undefined;
              } else {
                this.detailRowDef = c.value;
              }
              break;
          }
        }
      });
  }

  render(parent: PblNgridDetailRowComponent, fromRender: boolean): boolean {
    if (this.viewMap.has(parent)) {
      this.pendingOps.delete(parent); // if clear, then render we don't want to clear it later
      this.updateDetailRow(parent);
      return true;
    } else if (!this.deferOps) {
      return this._render(parent, fromRender);
    } else if (parent.context.$implicit && this.detailRowDef) {
      this.pendingOps.set(parent, { type: 'render', fromRender });
      return true;
    }
    return false;
  }

  clearDetailRow(parent: PblNgridDetailRowComponent, fromRender: boolean) {
    const state = this.viewMap.get(parent);
    if (state) {
      if (this.deferOps) {
        this.pendingOps.set(parent, { type: 'clear', fromRender });
      } else {
        this._clearDetailRow(parent, fromRender);
      }
    }
  }

  updateDetailRow(parent: PblNgridDetailRowComponent) {
    const state = this.viewMap.get(parent);
    if (state) {
      Object.assign(state.viewRef.context, this.createDetailRowContext(parent, true));
      state.viewRef.detectChanges();
    }
  }

  getDetailRowHeight(parent: PblNgridDetailRowComponent) {
    let total = 0;
    const state = this.viewMap.get(parent);
    if (state) {
      for (const e of state.viewRef.rootNodes) {
        total += e.getBoundingClientRect().height;
      }
    }
    return total;
  }

  detectChanges(parent: PblNgridDetailRowComponent) {
    const state = this.viewMap.get(parent);
    if (state) {
      state.viewRef.detectChanges();
    }
  }

  private createDetailRowContext(parent: PblNgridDetailRowComponent, fromRender: boolean): PblNgridDetailRowContext {
    return {
      $implicit: parent.context.$implicit,
      rowContext: parent.context,
      animation: { fromRender, end: () => this.checkHasAnimation(fromRender) ? this.runMeasure() : undefined, },
    }
  }

  private flushPendingOps() {
    if (this.deferOps) {
      this.deferOps = false;

      const toRender: Array<[PblNgridDetailRowComponent, PendingOperation]> = [];
      const toClear: Array<[PblNgridDetailRowComponent, PendingOperation]> = [];
      for (const entry of this.pendingOps.entries()) {
        const col = entry[1].type === 'clear' ? toClear : toRender;
        col.push(entry);
      }
      this.pendingOps.clear();

      for (const [parent, op] of toRender) {
        if (this.viewMap.has(parent)) {
          if (typeof ngDevMode === 'undefined' || ngDevMode) {
            throw new Error('Invalid detail row state.');
          }
          return;
        }
        if (toClear.length) {
          const [clearParent] = toClear.pop();

          this.viewMap.set(parent, this.viewMap.get(clearParent));
          this.viewMap.delete(clearParent);
          this.insertElementsToRow(parent); // don't detect changes, we'll do it in updateDetailRow
          this.updateDetailRow(parent);

          // notify about size changes
          if (!this.checkHasAnimation(op.fromRender)) {
            this.runMeasure();
          }
        } else {
          // when no more cleared left for reuse
          this._render(parent, op.fromRender);
        }
      }

      // remove cleared we can't reuse
      for (const [parent, op] of toClear) {
        this._clearDetailRow(parent, op.fromRender);
      }
    }
  }

  private _render(parent: PblNgridDetailRowComponent, fromRender: boolean): boolean {
    if (parent.context.$implicit && this.detailRowDef) {
      const context = this.createDetailRowContext(parent, fromRender);

      this.viewMap.set(parent, { viewRef: this.vcRef.createEmbeddedView(this.detailRowDef.tRef, context) })
      this.insertElementsToRow(parent, true);

      // notify about size changes
      if (!this.checkHasAnimation(fromRender)) {
        this.runMeasure();
      }
      return true;
    }
    return false;
  }

  private _clearDetailRow(parent: PblNgridDetailRowComponent, fromRender: boolean) {
    const state = this.viewMap.get(parent);
    if (state) {
      const { viewRef } = state;

      if (viewRef.context.animation.fromRender !== fromRender) {
        viewRef.context.animation.fromRender = fromRender;
        viewRef.detectChanges();
      }

      viewRef.destroy();

      if (!this.checkHasAnimation(fromRender)) {
        this.runMeasure();
      }

      this.viewMap.delete(parent);
    }
  }

  private insertElementsToRow(parent: PblNgridDetailRowComponent, detectChanges?: boolean) {
    const { viewRef } = this.viewMap.get(parent);
    const beforeNode = parent.element.nextSibling;
    for (const e of viewRef.rootNodes) {
      parent.element.parentElement.insertBefore(e, beforeNode);
    }
    if (detectChanges) {
      viewRef.detectChanges();
    }
  }

  private checkHasAnimation(fromRender: boolean) {
    return this.detailRowDef.hasAnimation === 'always' || (this.detailRowDef.hasAnimation === 'interaction' && !fromRender);
  }
}
