import { Observable, Subject } from 'rxjs';
import { Injector } from '@angular/core';

import { PblNgridComponent } from '../table/table.component';
import {
  PblNgridPlugin,
  PblNgridPluginExtension,
  PblNgridPluginExtensionFactories,
  PblNgridEvents,
} from './types';
import { PblNgridExtensionApi } from './table-ext-api';
import { PLUGIN_STORE } from './table-plugin';

const TABLE_PLUGIN_CONTEXT = new WeakMap<PblNgridComponent<any>, PblNgridPluginContext>();

/** @internal */
export class PblNgridPluginContext<T = any> {

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static create<T = any>(table: PblNgridComponent<any>, injector: Injector, extApi: PblNgridExtensionApi): PblNgridPluginContext<T> {
    if (TABLE_PLUGIN_CONTEXT.has(table)) {
      throw new Error(`Table is already registered for extensions.`);
    }

    const instance = new PblNgridPluginContext<T>();
    TABLE_PLUGIN_CONTEXT.set(table, instance);

    instance.table = table;
    instance.injector = injector;
    instance.extApi = extApi;
    instance.controller = new PblNgridPluginController(instance);

    return instance;
  }

  table: PblNgridComponent<any>;
  injector: Injector;
  extApi: PblNgridExtensionApi;
  controller: PblNgridPluginController<T>;
  readonly events: Observable<PblNgridEvents>;
  private _events = new Subject<PblNgridEvents>();

  private constructor() {
    this.events = this._events.asObservable();
  }

  emitEvent(event: PblNgridEvents): void {
    this._events.next(event);
  }

  destroy(): void  {
    if (!TABLE_PLUGIN_CONTEXT.has(this.table)) {
      throw new Error(`Table is not registered.`);
    }
    this._events.complete();
    TABLE_PLUGIN_CONTEXT.delete(this.table);
  }
}

export class PblNgridPluginController<T = any> {
  private static readonly created$ = new Subject<{ table: PblNgridComponent<any>, controller: PblNgridPluginController<any> }>();
  static readonly created = PblNgridPluginController.created$.asObservable();

  get injector(): Injector { return this.context.injector; }

  readonly extApi: PblNgridExtensionApi
  readonly events: Observable<PblNgridEvents>;
  private readonly grid: PblNgridComponent<T>
  private readonly plugins = new Map<keyof PblNgridPluginExtension, PblNgridPlugin>();

  constructor(private context: PblNgridPluginContext) {
    this.grid = context.table;
    this.extApi = context.extApi;
    this.events = context.events;
    PblNgridPluginController.created$.next({ table: this.grid, controller: this });
  }

  static find<T = any>(grid: PblNgridComponent<T>): PblNgridPluginController<T> | undefined {
    const context = TABLE_PLUGIN_CONTEXT.get(grid);
    if (context) {
      return context.controller;
    }
  }

  hasPlugin<P extends keyof PblNgridPluginExtension>(name: P): boolean {
    return this.plugins.has(name);
  }

  getPlugin<P extends keyof PblNgridPluginExtension>(name: P): PblNgridPluginExtension[P] | undefined  {
    return this.plugins.get(name) as any;
  }

  /**
   * Registers the `plugin` with the `name` with the `table`
   */
  setPlugin<P extends keyof PblNgridPluginExtension>(name: P, plugin: PblNgridPluginExtension[P]): (table: PblNgridComponent<any>) => void {
    if (!PLUGIN_STORE.has(name)) {
      throw new Error(`Unknown plugin ${name}.`);
    }
    if (this.plugins.has(name)) {
      throw new Error(`Plugin ${name} is not registered for this table.`);
    }
    this.plugins.set(name, plugin);
    return (tbl: PblNgridComponent<any>) => this.grid === tbl && this.plugins.delete(name);
  }

  createPlugin<P extends (keyof PblNgridPluginExtensionFactories & keyof PblNgridPluginExtension)>(name: P): PblNgridPluginExtension[P] {
    if (!PLUGIN_STORE.has(name)) {
      throw new Error(`Unknown plugin ${name}.`);
    }
    const metadata = PLUGIN_STORE.get(name);
    const methodName = metadata.factory;
    if (!methodName) {
      throw new Error(`Invalid plugin configuration for ${name}, no factory metadata.`);
    } else if (typeof metadata.target[methodName] !== 'function') {
      throw new Error(`Invalid plugin configuration for ${name}, factory metadata does not point to a function.`);
    }
    return metadata.target[methodName](this.grid, this.context.injector);
  }
}
