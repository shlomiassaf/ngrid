import { Observable, Subject } from 'rxjs';
import { Injector } from '@angular/core';

import { NegTableComponent } from '../table/table.component';
import {
  NegTablePlugin,
  NegTablePluginExtension,
  NegTablePluginExtensionFactories,
  NegTableEvents,
} from './types';

import { PLUGIN_STORE } from './table-plugin';

const TABLE_PLUGIN_CONTEXT = new WeakMap<NegTableComponent<any>, NegTablePluginContext>();

/** @internal */
export class NegTablePluginContext<T = any> {
  readonly controller: NegTablePluginController<T>;
  readonly events: Observable<NegTableEvents>;
  private _events = new Subject<NegTableEvents>();

  constructor(public table: NegTableComponent<any>, public injector: Injector) {
    if (TABLE_PLUGIN_CONTEXT.has(table)) {
      throw new Error(`Table is already registered for extensions.`);
    }

    TABLE_PLUGIN_CONTEXT.set(table, this);
    this.events = this._events.asObservable();
    this.controller = new NegTablePluginController(this);
  }

  emitEvent(event: NegTableEvents): void {
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

export class NegTablePluginController<T = any> {
  private static readonly created$ = new Subject<{ table: NegTableComponent<any>, controller: NegTablePluginController<any> }>();
  static readonly created = NegTablePluginController.created$.asObservable();

  readonly events: Observable<NegTableEvents>;
  private readonly table: NegTableComponent<T>
  private readonly plugins = new Map<keyof NegTablePluginExtension, NegTablePlugin>();

  constructor(private context: NegTablePluginContext) {
    this.table = context.table;
    this.events = context.events;
    NegTablePluginController.created$.next({ table: this.table, controller: this });
  }

  static find<T = any>(table: NegTableComponent<T>): NegTablePluginController<T> | undefined {
    const context = TABLE_PLUGIN_CONTEXT.get(table);
    if (context) {
      return context.controller;
    }
  }

  hasPlugin<P extends keyof NegTablePluginExtension>(name: P): boolean {
    return this.plugins.has(name);
  }

  getPlugin<P extends keyof NegTablePluginExtension>(name: P): NegTablePluginExtension[P] | undefined  {
    return this.plugins.get(name) as any;
  }

  /**
   * Registers the `plugin` with the `name` with the `table`
   */
  setPlugin<P extends keyof NegTablePluginExtension>(name: P, plugin: NegTablePluginExtension[P]): (table: NegTableComponent<any>) => void {
    if (!PLUGIN_STORE.has(name)) {
      throw new Error(`Unknown plugin ${name}.`);
    }
    if (this.plugins.has(name)) {
      throw new Error(`Plugin ${name} is not registered for this table.`);
    }
    this.plugins.set(name, plugin);
    return (tbl: NegTableComponent<any>) => this.table === tbl && this.plugins.delete(name);
  }

  createPlugin<P extends (keyof NegTablePluginExtensionFactories & keyof NegTablePluginExtension)>(name: P): NegTablePluginExtension[P] {
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
