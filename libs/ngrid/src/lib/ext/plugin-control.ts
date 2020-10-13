import { Observable, of, Subject } from 'rxjs';
import { filter, take, mapTo } from 'rxjs/operators';
import { InjectFlags, Injector } from '@angular/core';

import { PblNgridComponent } from '../grid/ngrid.component';
import {
  PblNgridPlugin,
  PblNgridPluginExtension,
  PblNgridPluginExtensionFactories,
  PblNgridEvents,
} from './types';
import { PblNgridExtensionApi } from './grid-ext-api';
import { PLUGIN_STORE } from './grid-plugin';

const NGRID_PLUGIN_CONTEXT = new WeakMap<PblNgridComponent<any>, PblNgridPluginContext>();

const CREATED$ = new Subject<{ table: PblNgridComponent<any>, controller: PblNgridPluginController<any> }>();

const REGISTERED_TO_CREATE = new WeakSet<any>();

/** @internal */
export class PblNgridPluginContext<T = any> {

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static create<T = any>(table: PblNgridComponent<any>, injector: Injector, extApi: PblNgridExtensionApi): PblNgridPluginContext<T> {
    if (NGRID_PLUGIN_CONTEXT.has(table)) {
      throw new Error(`Table is already registered for extensions.`);
    }

    const instance = new PblNgridPluginContext<T>();
    NGRID_PLUGIN_CONTEXT.set(table, instance);

    instance.grid = table;
    instance.injector = injector;
    instance.extApi = extApi;
    PblNgridPluginController.create<T>(instance);

    return instance;
  }

  grid: PblNgridComponent<any>;
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
    if (!NGRID_PLUGIN_CONTEXT.has(this.grid)) {
      throw new Error(`Table is not registered.`);
    }
    this._events.complete();
    NGRID_PLUGIN_CONTEXT.delete(this.grid);
  }
}

export class PblNgridPluginController<T = any> {
  static readonly created = CREATED$.asObservable();

  static onCreatedSafe(token: any, fn: (grid: PblNgridComponent<any>, controller: PblNgridPluginController<any>) => void) {
    if (!REGISTERED_TO_CREATE.has(token)) {
      REGISTERED_TO_CREATE.add(token);
      PblNgridPluginController.created.subscribe( event => fn(event.table, event.controller));
    }
  }

  static create<T = any>(context: PblNgridPluginContext<T>) {
    const controller = new PblNgridPluginController<T>(context);
    context.controller = controller;
    CREATED$.next({ table: context.grid, controller });
  }

  get injector(): Injector { return this.context.injector; }

  readonly extApi: PblNgridExtensionApi
  readonly events: Observable<PblNgridEvents>;
  private readonly grid: PblNgridComponent<T>
  private readonly plugins = new Map<keyof PblNgridPluginExtension, PblNgridPlugin>();

  private constructor(private context: PblNgridPluginContext) {
    this.grid = context.grid;
    this.extApi = context.extApi;
    this.events = context.events;
  }

  /**
   * A Simple shortcut to the `onInit` event which is fired once.
   * If the grid has already been init the event will fire immediately, otherwise it will emit once when `onInit`
   * occurs and cleanup the subscription.
   *
   * The boolean value emitted reflects the state it was emitted on.
   * false - grid was already initialized
   * true - grid was just initialized
   *
   * In other words, if you get false, it means you called this method when the grid was already initialized.
   */
  onInit() {
    if (this.grid.isInit) {
      return of(false);
    }

    return this.events
      .pipe(
        filter( e => e.kind === 'onInit' ),
        take(1),
        mapTo(true),
      );
  }

  static find<T = any>(grid: PblNgridComponent<T>): PblNgridPluginController<T> | undefined {
    const context = NGRID_PLUGIN_CONTEXT.get(grid);
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
      throw new Error(`Plugin ${name} is already registered for this grid.`);
    }
    this.plugins.set(name, plugin);
    return (tbl: PblNgridComponent<any>) => this.grid === tbl && this.plugins.delete(name);
  }

  /**
   * Checks if the grid is declared in a location within the DI that has access to an ancestor token.
   * For example, if we want to use `createPlugin()` only if the grid is defined in a module that has a specific parent module imported into it
   * we will use `hasAncestor(MyParentModule)`
   */
  hasAncestor(token: any) {
    return !!this.injector.get(token, null, InjectFlags.Optional);
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
