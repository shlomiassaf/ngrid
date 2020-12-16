import { PblNgridExtensionApi } from '@pebula/ngrid';
import { PblDropListRef } from '../core/drop-list-ref';
import { PblNgridRowReorderPluginDirective } from './row-reorder-plugin';
import { takeUntil } from 'rxjs/operators';
import { Type } from '@angular/core';

export type _PblDropListRef = Omit<PblDropListRef<PblNgridRowReorderPluginDirective<any>>, '_getItemIndexFromPointerPosition' | 'start'> & {
  start(): void;
  _getItemIndexFromPointerPosition(item: PblRowDropListRef, pointerX: number, pointerY: number, delta?: {x: number, y: number}): number
};

export const _PblDropListRef = () => { return PblDropListRef as any as Type<_PblDropListRef>; };

export class PblRowDropListRef<T = any> extends _PblDropListRef() {

  gridApi: PblNgridExtensionApi<T>;

  private scrollDif = 0;

  _getItemIndexFromPointerPosition(item: PblRowDropListRef, pointerX: number, pointerY: number, delta?: {x: number, y: number}): number {
    return super._getItemIndexFromPointerPosition(item, pointerX, pointerY - this.scrollDif, delta);
  }

  start(): void {
    super.start();
    this.scrollDif = 0;
    if (this.gridApi.grid.viewport.enabled) {
      const initialTop = this.gridApi.grid.viewport.measureScrollOffset();
      this.gridApi.grid.viewport.elementScrolled()
        .pipe(takeUntil(this.dropped))
        .subscribe(() => {
          this.scrollDif = this.gridApi.grid.viewport.measureScrollOffset() - initialTop;
        });
    }
  }

}

export function patchDropListRef<T = any>(dropListRef: PblDropListRef<PblNgridRowReorderPluginDirective<T>>, gridApi: PblNgridExtensionApi<T>) {
  try {
    Object.setPrototypeOf(dropListRef, PblRowDropListRef.prototype);
  } catch (err) {
    (dropListRef as any)._getItemIndexFromPointerPosition = PblRowDropListRef.prototype._getItemIndexFromPointerPosition;
    dropListRef.start = PblRowDropListRef.prototype.start;
  }

  (dropListRef as unknown as PblRowDropListRef).gridApi = gridApi;
}
