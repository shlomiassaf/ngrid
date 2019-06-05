import { Directive, OnDestroy, Injector } from '@angular/core';

import { UnRx } from '@pebula/utils';
import { PblNgridComponent, PblNgridPluginController, TablePlugin } from '@pebula/ngrid';
import { hasState, saveState, loadState } from './core/index';
import { includeDynamicUIState } from './presets';

declare module '@pebula/ngrid/lib/table/services/config' {
  interface PblNgridConfig {
    state?: {
      /** When set to true will enable the state plugin on all table instances by default. */
      autoEnable?: boolean;
    };
  }
}

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    state?: PblNgridStatePlugin;
  }
  interface PblNgridPluginExtensionFactories {
    state: keyof typeof PblNgridStatePlugin;
  }
}

export const PLUGIN_KEY: 'state' = 'state';

@TablePlugin({ id: PLUGIN_KEY, factory: 'create' })
@UnRx()
export class PblNgridStatePlugin {

  private _removePlugin: (table: PblNgridComponent<any>) => void;

  constructor(public grid: PblNgridComponent<any>, protected injector: Injector, protected pluginCtrl: PblNgridPluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    let onInvalidateHeaders = false;
    pluginCtrl.events
      .subscribe( event => {
        switch (event.kind) {
          case 'onInvalidateHeaders':
            if (!onInvalidateHeaders) {
              onInvalidateHeaders = true;
              loadState(
                grid,
                {
                  avoidRedraw: true,
                  include: includeDynamicUIState(),
                }
              );
            }
            break;
          case 'onDestroy':
            const p = saveState(
              grid,
              {
                include: includeDynamicUIState(),
              }
            );
            event.wait(p);
            break;
        }
      });
  }

  static create(table: PblNgridComponent<any>, injector: Injector): PblNgridStatePlugin {
    const pluginCtrl = PblNgridPluginController.find(table);
    return new PblNgridStatePlugin(table, injector, pluginCtrl);
  }

  destroy(): void {
    this._removePlugin(this.grid);
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'pbl-ngrid[statePlugin]',
})
@UnRx()
export class PblNgridStatePluginDirective extends PblNgridStatePlugin implements OnDestroy {

  constructor(grid: PblNgridComponent<any>, injector: Injector, pluginCtrl: PblNgridPluginController) {
    super(grid, injector, pluginCtrl);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
