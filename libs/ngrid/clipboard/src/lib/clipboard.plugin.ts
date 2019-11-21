import { filter } from 'rxjs/operators';
import { Directive, Injector, OnDestroy, Input } from '@angular/core';

// import { Clipboard } from '@angular/cdk-experimental/clipboard';
// TODO: remove internal implementation in the next version of cdk-experimental (right after 8.1.3)
import { Clipboard } from './clipboard.service';

import { UnRx } from '@pebula/utils';
import { PblNgridComponent, PblNgridPluginController, NgridPlugin, PblNgridConfigService } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    clipboard?: PblNgridClipboardPlugin;
  }
  interface PblNgridPluginExtensionFactories {
    clipboard: keyof typeof PblNgridClipboardPlugin;
  }
}

declare module '@pebula/ngrid/lib/grid/services/config' {
  interface PblNgridConfig {
    clipboard?: {
      /** When set to true will enable the clipboard plugin on all grid instances by default. */
      autoEnable?: boolean;
      /**
       * The separator to use when multiple cells are copied
       * @default \t
       */
      cellSeparator?: string;
      /**
       * The separator to use when multiple rows are copied
       * @default \n
       */
      rowSeparator?: string;
    };
  }
}

const IS_OSX = /^mac/.test(navigator.platform.toLowerCase())
const DEFAULT_CELL_SEP = '\t';
const DEFAULT_ROW_SEP = '\n';

export const PLUGIN_KEY: 'clipboard' = 'clipboard';

@NgridPlugin({ id: PLUGIN_KEY, factory: 'create' })
@Directive({ selector: 'pbl-ngrid[clipboard]', exportAs: 'pblNgridClipboard' })
@UnRx()
export class PblNgridClipboardPlugin implements OnDestroy {

  static create(grid: PblNgridComponent, injector: Injector): PblNgridClipboardPlugin {
    const pluginCtrl = PblNgridPluginController.find(grid);
    return new PblNgridClipboardPlugin(grid, injector, pluginCtrl);
  }

  /**
   * The separator to use when multiple cells are copied.
   * If not set, taken from `PblNgridConfig.clipboard.cellSeparator`
   * @default \t
   */
  @Input() clpCellSep: string;

  /**
   * The separator to use when multiple rows are copied
   * If not set, taken from `PblNgridConfig.clipboard.rowSeparator`
   * @default \n
   */
  @Input() clpRowSep: string;

  private config: PblNgridConfigService;
  private clipboard: Clipboard;
  private _removePlugin: (grid: PblNgridComponent) => void;

  constructor(public grid: PblNgridComponent<any>, protected injector: Injector, protected pluginCtrl: PblNgridPluginController) {
    this.config = injector.get(PblNgridConfigService)
    this.clipboard = injector.get(Clipboard);
    this.init();
  }

  ngOnDestroy(): void {
    this._removePlugin(this.grid);
  }

  protected isCopyEvent(event: Event): boolean {
    if (event instanceof KeyboardEvent && event.key === 'c') {
      if ((!IS_OSX && event.ctrlKey) || (IS_OSX && event.metaKey)) {
        return true;
      }
    }
    return false;
  }

  protected doCopy(): void {
    const { cellSeparator, rowSeparator } = this.config.get('clipboard', {});
    const { rows, minIndex } = this.getSelectedRowData(this.grid);
    const createRow = (row: any[]) => row.slice(minIndex).join(this.clpCellSep || cellSeparator || DEFAULT_CELL_SEP);
    // For each row (collection of items), slice the initial items that are not copied across all selections

    this.clipboard.copy(rows.map(createRow).join(this.clpRowSep || rowSeparator || DEFAULT_ROW_SEP));
    // TODO: Consider using `beginCopy` to support large copy operations
  }

  protected getSelectedRowData(grid: PblNgridComponent) {
    const { columnApi, contextApi } = grid;
    const data = new Map<any, any[]>();

    // The minIndex represents the first column being copied out of all visible columns (0 being the first visible column).
    // For every selected cell, the column is tracked and it's index is being set to `minIndex` if it is lower then the current `minIndex` (Math.Min).
    // We start with the biggest int but right away get a valid column index...
    // Later on, each row is sliced to remove the items in indices lower then the `minIndex`.
    //
    // All of this is to make the paste start without leading cell separators.
    let minIndex = Number.MAX_SAFE_INTEGER;

    for (const point of contextApi.selectedCells) {
      const col = columnApi.columns[point.colIndex];
      if (col) {
        const colIndex = columnApi.renderIndexOf(col);
        if (colIndex > -1) {
          const rowIndex = contextApi.findRowInCache(point.rowIdent).dataIndex;
          const dataItem = col.getValue(grid.ds.source[rowIndex]);
          const row = data.get(point.rowIdent) || [];
          row[colIndex] = dataItem;
          data.set(point.rowIdent, row);
          minIndex = Math.min(minIndex, colIndex);
        }
      }
    }

    return {
      minIndex,
      rows: Array.from(data.values()),
    };
  }

  private init(): void {
    this._removePlugin = this.pluginCtrl.setPlugin(PLUGIN_KEY, this);

    if (!this.pluginCtrl.hasPlugin('targetEvents')) {
      this.pluginCtrl.createPlugin('targetEvents');
    }

    const targetEvents = this.pluginCtrl.getPlugin('targetEvents');
    targetEvents.keyDown
      .pipe(
        filter( event => this.isCopyEvent(event.source) ),
        UnRx(this)
      )
      .subscribe( event => this.doCopy() );
  }
}
