import { PblNgridInternalExtensionApi } from '../../../ext/grid-ext-api';
import { PblNgridComponent } from '../../ngrid.component';
import { PblColumn } from '../../column/model/column';
import { PblColumnSizeObserver } from './column-size-observer';

const PBL_NGRID_MAP = new Map<PblNgridComponent<any>, PblNgridColumnSizeObserverGroup>();

/**
 * A controller that groups columns of a grid and listens to resize events
 * and will notify the grid once resize occurs
 */
export class PblNgridColumnSizeObserverGroup {
  private entries: WeakMap<any, PblColumnSizeObserver>;
  private ro: ResizeObserver;
  private columns: PblColumnSizeObserver[] = [];

  constructor(private extApi: PblNgridInternalExtensionApi) {
    this.entries = new WeakMap<any, PblColumnSizeObserver>();
    this.ro = new ResizeObserver( entries => {
      requestAnimationFrame(() => this.onResize(entries) );
    });
  }

  static get(extApi: PblNgridInternalExtensionApi): PblNgridColumnSizeObserverGroup {
    let controller = PBL_NGRID_MAP.get(extApi.grid);
    if (!controller) {
      controller = new PblNgridColumnSizeObserverGroup(extApi);
      PBL_NGRID_MAP.set(extApi.grid, controller);
    }
    return controller;
  }

  has(col: PblColumnSizeObserver): boolean {
    return this.columns.indexOf(col) !== -1;
  }

  hasColumn(column: PblColumn): boolean {
    return this.columns.some( c => c.column === column );
  }

  add(col: PblColumnSizeObserver): void {
    this.entries.set(col.target, col);
    this.ro.observe(col.target);
    this.columns.push(col);
  }

  remove(col: PblColumnSizeObserver): void {
    this.ro.unobserve(col.target);
    this.entries.delete(col.target);
    const idx = this.columns.indexOf(col);
    if (idx > -1) {
      this.columns.splice(idx, 1);
    }
    if (this.columns.length === 0) {
      this.ro.disconnect();
      PBL_NGRID_MAP.delete(this.extApi.grid);
    }
  }

  private onResize(entries: ResizeObserverEntry[] | readonly ResizeObserverEntry[]): void {
    const resized: PblColumnSizeObserver[] = [];
    for (const entry of entries) {
      const o = this.entries.get(entry.target);
      if (o) {
        resized.push(o);
      }
    }
    if (resized.length > 0) {
      let isDragging = false;
      for (const c of resized) {
        isDragging = isDragging || c.column.columnDef.isDragging;
        c.updateSize();
      }
      if (!isDragging) {
        this.extApi.widthCalc.calcColumnWidth(this.columns.map( c => c.column ));
      }
    }
  }
}
