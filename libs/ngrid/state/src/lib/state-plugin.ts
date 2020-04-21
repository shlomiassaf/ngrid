import { Subject, Observable, from } from 'rxjs';
import { map, mapTo, filter, take, skip, debounceTime } from 'rxjs/operators';
import { Directive, OnDestroy, Injector, Input } from '@angular/core';

import { PblNgridComponent, PblNgridPluginController } from '@pebula/ngrid';
import { hasState, saveState, loadState, PblNgridStateLoadOptions, PblNgridStateSaveOptions } from './core/index';

import { userSessionPref } from './presets';

declare module '@pebula/ngrid/lib/grid/services/config' {
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

interface InternalStatePluginEvents {
  phase: 'load' | 'save';
  position: 'before' | 'after';
  error?: Error;
}

export const PLUGIN_KEY: 'state' = 'state';

export class PblNgridStatePlugin {

  loadOptions?: PblNgridStateLoadOptions;
  saveOptions?: PblNgridStateSaveOptions;

  afterLoadState: Observable<void>;
  afterSaveState: Observable<void>;
  onError: Observable<{ phase: 'save' | 'load'; error: Error; }>;

  private _removePlugin: (table: PblNgridComponent<any>) => void;
  private _events = new Subject<InternalStatePluginEvents>();

  constructor(public grid: PblNgridComponent<any>, protected injector: Injector, protected pluginCtrl: PblNgridPluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    this.afterLoadState = this._events.pipe(filter( e => e.phase === 'load' && e.position === 'after'), mapTo(undefined) );
    this.afterSaveState = this._events.pipe(filter( e => e.phase === 'save' && e.position === 'after'), mapTo(undefined) );
    this.onError = this._events.pipe(filter( e => !!e.error ), map( e => ({ phase: e.phase, error: e.error })) );

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
              return this._load(initialLoadOptions);
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
          this._events.complete();
        }
      });
  }

  static create(table: PblNgridComponent<any>, injector: Injector): PblNgridStatePlugin {
    const pluginCtrl = PblNgridPluginController.find(table);
    return new PblNgridStatePlugin(table, injector, pluginCtrl);
  }

  load(): Promise<void> {
    return this._load(this.loadOptions);
  }

  save(): Promise<void> {
    return saveState(this.grid, this.saveOptions)
      .then( () => this._events.next({phase: 'save', position: 'after'}) )
      .catch( error => this._events.next({phase: 'save', position: 'after', error }) );
  }

  destroy(): void {
    this._removePlugin(this.grid);
  }

  private _load(loadOptions: PblNgridStateLoadOptions): Promise<void> {
    return loadState(this.grid, loadOptions)
      .then( () => this._events.next({phase: 'load', position: 'after'}) )
      .catch( error => this._events.next({phase: 'load', position: 'after', error }) );
  }

}

@Directive({
  selector: 'pbl-ngrid[persistState]', // tslint:disable-line:directive-selector
  outputs: ['afterLoadState', 'afterSaveState', 'onError'],
})
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
