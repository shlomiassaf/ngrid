
import { Directive, Injector, OnDestroy } from '@angular/core';
// import { Clipboard } from '@angular/cdk-experimental/clipboard';
// TODO: remove internal implementation in the next version of cdk-experimental (right after 8.1.3)
import { Clipboard } from './clipboard.service';

import { UnRx } from '@pebula/utils';
import { PblNgridComponent, PblNgridPluginController, TablePlugin } from '@pebula/ngrid';
import { PblNgridCellEvent, PblNgridRowEvent } from '@pebula/ngrid/target-events';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    clipboard?: PblNgridClipboardPlugin;
  }
  interface PblNgridPluginExtensionFactories {
    clipboard: keyof typeof PblNgridClipboardPlugin;
  }
}

declare module '@pebula/ngrid/lib/table/services/config' {
  interface PblNgridConfig {
    clipboard?: {
      /** When set to true will enable the clipboard plugin on all grid instances by default. */
      autoEnable?: boolean;
    };
  }
}

const IS_OSX = /^mac/.test(navigator.platform.toLowerCase())

export const PLUGIN_KEY: 'clipboard' = 'clipboard';

@TablePlugin({ id: PLUGIN_KEY, factory: 'create' })
@Directive({ selector: 'pbl-ngrid[clipboard]', exportAs: 'pblNgridClipboard' })
@UnRx()
export class PblNgridClipboardPlugin implements OnDestroy {

  static create(grid: PblNgridComponent, injector: Injector): PblNgridClipboardPlugin {
    const pluginCtrl = PblNgridPluginController.find(grid);
    return new PblNgridClipboardPlugin(grid, injector, pluginCtrl);
  }

  private clipboard: Clipboard;
  private _removePlugin: (grid: PblNgridComponent) => void;

  constructor(public grid: PblNgridComponent<any>, protected injector: Injector, protected pluginCtrl: PblNgridPluginController) {
    this.clipboard = injector.get(Clipboard);
    this.init();
  }

  ngOnDestroy(): void {
    this._removePlugin(this.grid);
  }

  private init(): void {
    this._removePlugin = this.pluginCtrl.setPlugin(PLUGIN_KEY, this);

    if (!this.pluginCtrl.hasPlugin('targetEvents')) {
      this.pluginCtrl.createPlugin('targetEvents');
    }

    const targetEvents = this.pluginCtrl.getPlugin('targetEvents');
    targetEvents.keyDown
      .pipe(UnRx(this))
      .subscribe( event => this.checkCopy(event) );
  }

  private checkCopy(event: PblNgridCellEvent<any, KeyboardEvent> | PblNgridRowEvent<any>): void {
    const eSource = event.source;
    if (eSource instanceof KeyboardEvent) {
      if (eSource.key === 'c' && ((!IS_OSX && eSource.ctrlKey) || (IS_OSX && eSource.metaKey))) {
        let minIndex = Number.MAX_SAFE_INTEGER;
        const data = new Map<any, any[]>();
        for (const point of this.grid.contextApi.selectedCells) {

          const col = this.grid.columnApi.columns[point.colIndex];
          if (col) {
            const colIndex = this.grid.columnApi.renderIndexOf(col);
            if (colIndex > -1) {
              const rowIndex = this.grid.contextApi.findRowInCache(point.rowIdent).dataIndex;
              const dataItem = col.getValue(this.grid.ds.source[rowIndex]);
              const row = data.get(point.rowIdent) || [];
              row[colIndex] = dataItem;
              data.set(point.rowIdent, row);
              minIndex = Math.min(minIndex, colIndex);
            }
          }
        }

        const rows = Array.from(data.values());
        this.clipboard.copy( rows.map( r => r.slice(minIndex).join('\t') ).join('\n') );
      }
    }
  }
}
