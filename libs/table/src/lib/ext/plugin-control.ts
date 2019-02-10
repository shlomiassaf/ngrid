import { Observable, Subject } from 'rxjs';
import { Injector } from '@angular/core';

import { PblTableComponent } from '../table/table.component';
import {
  PblTablePlugin,
  PblTablePluginExtension,
  PblTablePluginExtensionFactories,
  PblTableEvents,
} from './types';
import { PblTableExtensionApi } from './table-ext-api';
import { PLUGIN_STORE } from './table-plugin';

const TABLE_PLUGIN_CONTEXT = new WeakMap<PblTableComponent<any>, PblTablePluginContext>();

/** @internal */
export class PblTablePluginContext<T = any> {
  readonly controller: PblTablePluginController<T>;
  readonly events: Observable<PblTableEvents>;
  private _events = new Subject<PblTableEvents>();

  constructor(public table: PblTableComponent<any>, public injector: Injector, public extApi: PblTableExtensionApi) {
    if (TABLE_PLUGIN_CONTEXT.has(table)) {
      throw new Error(`Table is already registered for extensions.`);
    }

    TABLE_PLUGIN_CONTEXT.set(table, this);
    this.events = this._events.asObservable();
    this.controller = new PblTablePluginController(this);
  }

  emitEvent(event: PblTableEvents): void {
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

export class PblTablePluginController<T = any> {
  private static readonly created$ = new Subject<{ table: PblTableComponent<any>, controller: PblTablePluginController<any> }>();
  static readonly created = PblTablePluginController.created$.asObservable();

  readonly extApi: PblTableExtensionApi
  readonly events: Observable<PblTableEvents>;
  private readonly table: PblTableComponent<T>
  private readonly plugins = new Map<keyof PblTablePluginExtension, PblTablePlugin>();

  constructor(private context: PblTablePluginContext) {
    this.table = context.table;
    this.extApi = context.extApi;
    this.events = context.events;
    PblTablePluginController.created$.next({ table: this.table, controller: this });
  }

  static find<T = any>(table: PblTableComponent<T>): PblTablePluginController<T> | undefined {
    const context = TABLE_PLUGIN_CONTEXT.get(table);
    if (context) {
      return context.controller;
    }
  }

  hasPlugin<P extends keyof PblTablePluginExtension>(name: P): boolean {
    return this.plugins.has(name);
  }

  getPlugin<P extends keyof PblTablePluginExtension>(name: P): PblTablePluginExtension[P] | undefined  {
    return this.plugins.get(name) as any;
  }

  /**
   * Registers the `plugin` with the `name` with the `table`
   */
  setPlugin<P extends keyof PblTablePluginExtension>(name: P, plugin: PblTablePluginExtension[P]): (table: PblTableComponent<any>) => void {
    if (!PLUGIN_STORE.has(name)) {
      throw new Error(`Unknown plugin ${name}.`);
    }
    if (this.plugins.has(name)) {
      throw new Error(`Plugin ${name} is not registered for this table.`);
    }
    this.plugins.set(name, plugin);
    return (tbl: PblTableComponent<any>) => this.table === tbl && this.plugins.delete(name);
  }

  createPlugin<P extends (keyof PblTablePluginExtensionFactories & keyof PblTablePluginExtension)>(name: P): PblTablePluginExtension[P] {
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
    return metadata.target[methodName](this.table, this.context.injector);
  }
}
