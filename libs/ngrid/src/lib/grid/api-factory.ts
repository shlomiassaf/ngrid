import { Observable, of, Subject, EMPTY } from 'rxjs';
import { ChangeDetectorRef, ElementRef, Injector, IterableDiffers, NgZone, ViewContainerRef } from '@angular/core';
import { Direction, Directionality } from '@angular/cdk/bidi';

import { PblNgridConfigService, PblNgridEvents, ON_DESTROY, ON_CONSTRUCTED, PblNgridRegistryService } from '@pebula/ngrid/core';
import { PblNgridInternalExtensionApi } from '../ext/grid-ext-api';
import { PblNgridPluginContext } from '../ext/plugin-control';
import { OnPropChangedEvent } from '../ext/types';
import { ColumnApi, PblColumnStore } from './column/management';
import { PblNgridColumnWidthCalc } from './column/width-logic/column-width-calc';
import { PblNgridComponent } from './ngrid.component';
import { PblCdkTableComponent } from './pbl-cdk-table/pbl-cdk-table.component';
import { PblRowsApi } from './row/rows-api';
import { PblNgridCellFactoryResolver } from './row/cell-factory.service';
import { ContextApi } from './context/api';
import { PblNgridMetaRowService } from './meta-rows/meta-row.service';
import { PblCdkVirtualScrollViewportComponent } from './features/virtual-scroll/virtual-scroll-viewport.component';
import { bindGridToDataSource } from './bind-grid-to-datasource';
import { logicap, Logicaps } from './logicap/index';

export interface RequiredAngularTokens {
  ngZone: NgZone;
  injector: Injector;
  vcRef: ViewContainerRef;
  cdRef: ChangeDetectorRef;
  elRef: ElementRef<HTMLElement>;
  config: PblNgridConfigService;
  registry: PblNgridRegistryService;
  dir?: Directionality;
}

export function createApis<T>(grid: PblNgridComponent<T>, tokens: RequiredAngularTokens) {
  return new InternalExtensionApi(grid, tokens);
}

class InternalExtensionApi<T = any> implements PblNgridInternalExtensionApi<T> {
  readonly config: PblNgridConfigService;
  readonly registry: PblNgridRegistryService;
  readonly element: HTMLElement;
  readonly propChanged: Observable<OnPropChangedEvent>;
  readonly columnStore: PblColumnStore;
  readonly columnApi: ColumnApi<T>;
  readonly metaRowService: PblNgridMetaRowService<T>;
  readonly rowsApi: PblRowsApi<T>;
  readonly events: Observable<PblNgridEvents>;
  readonly plugin: PblNgridPluginContext;
  readonly widthCalc: PblNgridColumnWidthCalc;
  readonly logicaps: Logicaps;

  get cdkTable() { return this._cdkTable; }
  get contextApi() { return this._contextApi || (this._contextApi = new ContextApi<T>(this)); }
  get viewport(): PblCdkVirtualScrollViewportComponent { return this._viewPort; }
  get pluginCtrl() { return this.plugin.controller; }

  private _cdkTable: PblCdkTableComponent<T>;
  private _contextApi: ContextApi<T>;
  private _viewPort: PblCdkVirtualScrollViewportComponent;
  private _create: () => void;
  private dir?: Directionality;
  private readonly _propChanged: Subject<OnPropChangedEvent>;

  constructor(public readonly grid: PblNgridComponent<T>, tokens: RequiredAngularTokens) {
    this.propChanged = this._propChanged = new Subject<OnPropChangedEvent>();

    this.config = tokens.config;
    this.registry = tokens.registry;
    this.element = tokens.elRef.nativeElement;
    if (tokens.dir) {
      this.dir = tokens.dir;
    }

    const { plugin, init } = this.createPlugin(tokens);
    this._create = init;
    this.plugin = plugin;
    this.events = plugin.events;
    this.columnStore = new PblColumnStore(this, tokens.injector.get(IterableDiffers));
    this.widthCalc = new PblNgridColumnWidthCalc(this);

    const cellFactory = tokens.injector.get(PblNgridCellFactoryResolver);
    this.rowsApi = new PblRowsApi<T>(this, tokens.ngZone, cellFactory);

    this.columnApi = ColumnApi.create<T>(this);
    this.metaRowService = new PblNgridMetaRowService(this);
    this._contextApi = new ContextApi<T>(this);
    this.logicaps = logicap(this);

    bindGridToDataSource(this);

    this.events.pipe(ON_DESTROY).subscribe( e => this._propChanged.complete() );

    this.widthCalc
      .onWidthCalc
      .subscribe( rowWidth => {
        this._cdkTable.minWidth = rowWidth.minimumRowWidth;

        tokens.ngZone.run( () => {
          this.rowsApi.syncRows('header');
          this.plugin.emitEvent({ source: 'grid', kind: 'onResizeRow' });
        });
      });
  }

  getDirection() {
    return this.dir?.value ?? 'ltr';
  }

  directionChange(): Observable<Direction> {
    return this.dir?.change.asObservable() ?? EMPTY;
  }

  onConstructed(fn: () => void) {
    if (!this._create) {
      of(false);
    } else {
      this.events.pipe(ON_CONSTRUCTED).subscribe(fn);
    }
  }

  onInit(fn: () => void) {
    this.plugin.controller.onInit().subscribe(fn);
  }

  setCdkTable(cdkTable: PblCdkTableComponent<T>) {
    this._cdkTable = cdkTable;
    const globalCreateEvent = this._create;
    delete this._create;
    this.plugin.emitEvent({ source: 'grid', kind: 'onConstructed' });
    globalCreateEvent();
  }

  setViewport(viewport: PblCdkVirtualScrollViewportComponent) {
    this._viewPort = viewport;
  }

  notifyPropChanged(source, key, prev, curr) {
    if (prev !== curr) {
      this._propChanged.next({source, key, prev, curr} as any);
    }
  }

  private createPlugin(tokens: RequiredAngularTokens) {
    // Create an injector for the extensions/plugins
    // This injector allow plugins (that choose so) to provide a factory function for runtime use.
    // I.E: as if they we're created by angular via template...
    // This allows seamless plugin-to-plugin dependencies without requiring specific template syntax.
    // And also allows auto plugin binding (app wide) without the need for template syntax.
    const pluginInjector = Injector.create({
      providers: [
        { provide: ViewContainerRef, useValue: tokens.vcRef },
        { provide: ElementRef, useValue: tokens.elRef },
        { provide: ChangeDetectorRef, useValue: tokens.cdRef },
      ],
      parent: tokens.injector,
    });
    return PblNgridPluginContext.create(pluginInjector, this);
  }
}
