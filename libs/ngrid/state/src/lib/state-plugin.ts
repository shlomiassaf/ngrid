import { filter, take, skip, debounceTime } from 'rxjs/operators';
import { Directive, OnDestroy, Injector, Input } from '@angular/core';

import { UnRx } from '@pebula/utils';
import { PblNgridComponent, PblNgridPluginController, TablePlugin } from '@pebula/ngrid';
import { hasState, saveState, loadState, PblNgridStateLoadOptions, PblNgridStateSaveOptions } from './core/index';
import { userSessionPref } from './presets';

declare module '@pebula/ngrid/lib/table/services/config' {
  interface PblNgridConfig {
    state?: {
      /** When set to true will enable the state plugin on all table instances by default. */
      autoEnable?: boolean;
      /**
       * Options to use when auto-loading the plugin
       */
      autoEnableOptions?: {
        loadOptions?: PblNgridStateLoadOptions;
        saveOptions?: PblNgridStateSaveOptions;
      }
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

  loadOptions?: PblNgridStateLoadOptions;
  saveOptions?: PblNgridStateSaveOptions;

  private _removePlugin: (table: PblNgridComponent<any>) => void;

  constructor(public grid: PblNgridComponent<any>, protected injector: Injector, protected pluginCtrl: PblNgridPluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    pluginCtrl.events
      .pipe(
        filter( e => e.kind === 'onInvalidateHeaders'),
        take(1),
      )
      .subscribe( event => {
        const initialLoadOptions = { ...(this.loadOptions || {}), avoidRedraw: true };
        hasState(grid, initialLoadOptions)
          .then( value => {
            if (value) {
              return loadState(grid, initialLoadOptions);
            }
          })
          .then( () => {
            pluginCtrl.events
            .pipe(
              filter( e => e.kind === 'onResizeRow'),
              skip(1),
              debounceTime(500),
            )
            .subscribe( event => this.save() );
          });
      });

    pluginCtrl.events
      .subscribe( event => {
        if (event.kind === 'onDestroy') {
          event.wait(this.save());
        }
      });
  }

  static create(table: PblNgridComponent<any>, injector: Injector): PblNgridStatePlugin {
    const pluginCtrl = PblNgridPluginController.find(table);
    return new PblNgridStatePlugin(table, injector, pluginCtrl);
  }

  load(): Promise<void> {
    return loadState(this.grid, this.loadOptions).then( () => {} );
  }

  save(): Promise<void> {
    return saveState(this.grid, this.saveOptions);
  }

  destroy(): void {
    this._removePlugin(this.grid);
  }
}

@Directive({
  selector: 'pbl-ngrid[persistState]', // tslint:disable-line:directive-selector
})
@UnRx()
export class PblNgridStatePluginDirective extends PblNgridStatePlugin implements OnDestroy {

  @Input() loadOptions: PblNgridStateLoadOptions = { include: userSessionPref() };
  @Input() saveOptions: PblNgridStateSaveOptions = { include: userSessionPref() };

  constructor(grid: PblNgridComponent<any>, injector: Injector, pluginCtrl: PblNgridPluginController) {
    super(grid, injector, pluginCtrl);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
