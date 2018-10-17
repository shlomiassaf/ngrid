import { Observable, Subject } from 'rxjs';
import { Injector } from '@angular/core';

import { SgTableComponent } from '../table/table.component';
import {
  SgTablePlugin,
  SgTablePluginExtension,
  SgTablePluginExtensionFactories,
  SgTableEvents,
} from './types';

import { PLUGIN_STORE } from './table-plugin';

const TABLE_PLUGIN_CONTEXT = new WeakMap<SgTableComponent<any>, SgTablePluginContext>();

/** @internal */
export class SgTablePluginContext<T = any> {
  readonly controller: SgTablePluginController<T>;
  readonly events: Observable<SgTableEvents>;
  private _events = new Subject<SgTableEvents>();

  constructor(public table: SgTableComponent<any>, public injector: Injector) {
    if (TABLE_PLUGIN_CONTEXT.has(table)) {
      throw new Error(`Table is already registered for extensions.`);
    }

    TABLE_PLUGIN_CONTEXT.set(table, this);
    this.events = this._events.asObservable();
    this.controller = new SgTablePluginController(this);
  }

  emitEvent(event: SgTableEvents): void {
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

export class SgTablePluginController<T = any> {
  private static readonly created$ = new Subject<{ table: SgTableComponent<any>, controller: SgTablePluginController<any> }>();
  static readonly created = SgTablePluginController.created$.asObservable();

  readonly events: Observable<SgTableEvents>;
  private readonly table: SgTableComponent<T>
  private readonly plugins = new Map<keyof SgTablePluginExtension, SgTablePlugin>();

  constructor(private context: SgTablePluginContext) {
    this.table = context.table;
    this.events = context.events;
    SgTablePluginController.created$.next({ table: this.table, controller: this });
  }

  static find<T = any>(table: SgTableComponent<T>): SgTablePluginController<T> | undefined {
    const context = TABLE_PLUGIN_CONTEXT.get(table);
    if (context) {
      return context.controller;
    }
  }

  hasPlugin<P extends keyof SgTablePluginExtension>(name: P): boolean {
    return this.plugins.has(name);
  }

  getPlugin<P extends keyof SgTablePluginExtension>(name: P): SgTablePluginExtension[P] | undefined  {
    return this.plugins.get(name) as any;
  }

  /**
   * Registers the `plugin` with the `name` with the `table`
   */
  setPlugin<P extends keyof SgTablePluginExtension>(name: P, plugin: SgTablePluginExtension[P]): (table: SgTableComponent<any>) => void {
    if (!PLUGIN_STORE.has(name)) {
      throw new Error(`Unknown plugin ${name}.`);
    }
    if (this.plugins.has(name)) {
      throw new Error(`Plugin ${name} is not registered for this table.`);
    }
    this.plugins.set(name, plugin);
    return (tbl: SgTableComponent<any>) => this.table === tbl && this.plugins.delete(name);
  }

  createPlugin<P extends (keyof SgTablePluginExtensionFactories & keyof SgTablePluginExtension)>(name: P): SgTablePluginExtension[P] {
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
