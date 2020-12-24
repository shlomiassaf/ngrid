import {
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  Input,
  NgZone,
  ViewContainerRef,
  Renderer2,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  ApplicationRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { unrx, PblNgridConfigService } from '@pebula/ngrid/core';
import { PblNgridComponent, PblNgridPluginController } from '@pebula/ngrid';
import { PblNgridCellEvent } from '@pebula/ngrid/target-events';

declare module '@pebula/ngrid/core/lib/configuration/type' {
  interface PblNgridConfig {
    bsCellTooltip?: CellTooltipOptions & {
      /** When set to true will apply the default cell tooltip to ALL tables */
      autoSetAll?: boolean;
    };
  }
}

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    bsCellTooltip?: PblNgridCellTooltipDirective<any>;
  }
  interface PblNgridPluginExtensionFactories {
    bsCellTooltip: keyof typeof PblNgridCellTooltipDirective;
  }
}

export const PLUGIN_KEY: 'bsCellTooltip' = 'bsCellTooltip';

const DEFAULT_OPTIONS: CellTooltipOptions = {
  canShow: (event: PblNgridCellEvent<any>): boolean => {
    const element = (event.cellTarget.firstElementChild || event.cellTarget) as HTMLElement;
    return element.scrollWidth > element.offsetWidth;
  },
  message: (event: PblNgridCellEvent<any>): string => {
    return event.cellTarget.innerText;
  }
};

export interface CellTooltipOptions {
  canShow?: boolean | ( (event: PblNgridCellEvent<any>) => boolean );
  message?: (event: PblNgridCellEvent<any>) => string;
}

@Directive({ selector: '[bsCellTooltip]', exportAs: 'bsCellTooltip' })
export class PblNgridCellTooltipDirective<T> implements CellTooltipOptions, OnDestroy {
  static readonly PLUGIN_KEY: 'bsCellTooltip' = PLUGIN_KEY;

  // tslint:disable-next-line:no-input-rename
  @Input('bsCellTooltip') set canShow(value: boolean | ( (event: PblNgridCellEvent<T>) => boolean )) {
    if (typeof value === 'function') {
      this._canShow = value;
    } else if ( (value as any) === '') {
      this._canShow = undefined;
    } else {
      this._canShow = coerceBooleanProperty(value) ? e => true : e => false;
    }
  }

  @Input() message: (event: PblNgridCellEvent<T>) => string;

  @Input() tooltipClass: string;
  @Input() showDelay: number;
  @Input() hideDelay: number;

  private initArgs: [ Renderer2, Injector, ComponentFactoryResolver, ViewContainerRef, NgbTooltipConfig, NgZone, any, ChangeDetectorRef, ApplicationRef ];

  private toolTip: NgbTooltip;
  private lastConfig: CellTooltipOptions;
  private _removePlugin: (table: PblNgridComponent<any>) => void;
  private _canShow: (event: PblNgridCellEvent<T>) => boolean;

  constructor(private table: PblNgridComponent<any>, private injector: Injector, pluginCtrl: PblNgridPluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    const configService = injector.get(PblNgridConfigService);

    this.initArgs = [
      injector.get(Renderer2),
      injector,
      injector.get(ComponentFactoryResolver),
      injector.get(ViewContainerRef),
      injector.get(NgbTooltipConfig),
      injector.get(NgZone),
      injector.get(DOCUMENT),
      injector.get(ChangeDetectorRef),
      injector.get(ApplicationRef),
    ];

    configService.onUpdate('bsCellTooltip')
      .pipe(unrx(this))
      .subscribe( cfg => this.lastConfig = cfg.curr );

    pluginCtrl.onInit().subscribe( () => this.init(pluginCtrl) );
  }

  static create<T = any>(table: PblNgridComponent<any>, injector: Injector): PblNgridCellTooltipDirective<T> {
    return new PblNgridCellTooltipDirective<T>(table, injector, PblNgridPluginController.find(table));
  }

  ngOnDestroy(): void {
    this._removePlugin(this.table);
    this.killTooltip();
    unrx.kill(this);
  }

  private init(pluginCtrl: PblNgridPluginController): void {
    // Depends on target-events plugin
    // if it's not set, create it.
    const targetEventsPlugin = pluginCtrl.getPlugin('targetEvents') || pluginCtrl.createPlugin('targetEvents');
    targetEventsPlugin.cellEnter
      .pipe(unrx(this))
      .subscribe( event => this.cellEnter(event) );

    targetEventsPlugin.cellLeave
      .pipe(unrx(this))
      .subscribe( event => this.cellLeave(event) );
  }

  private cellEnter(event: PblNgridCellEvent<T>): void {
    this.killTooltip();

    if (!this._canShow) {
      // TODO: this will set lastConfig / default option once
      // but if user changes lastConfig it will never update again...
      this.canShow = (this.lastConfig && this.lastConfig.canShow) || DEFAULT_OPTIONS.canShow;
    }

    if (this._canShow(event)) {
      const params = this.initArgs.slice() as PblNgridCellTooltipDirective<any>['initArgs'];

      this.toolTip = new NgbTooltip(
        new ElementRef<any>(event.cellTarget),
        ...params,
      );

      this.toolTip.container = 'body';
      const message = this.message || (this.lastConfig && this.lastConfig.message) || DEFAULT_OPTIONS.message;
      this.toolTip.ngbTooltip = message(event);

      // if (this.position) {
      //   this.toolTip.position = this.position;
      // }
      if (this.tooltipClass) {
        this.toolTip.tooltipClass = this.tooltipClass;
      }
      if (this.showDelay >= 0) {
        this.toolTip.openDelay = this.showDelay;
      }
      if (this.hideDelay >= 0) {
        this.toolTip.closeDelay = this.hideDelay;
      }
      this.toolTip.open();
    }
  }

  private cellLeave(event: PblNgridCellEvent<T>): void {
    this.killTooltip();
  }

  private killTooltip(): void {
    if (this.toolTip) {
      this.toolTip.close();
      this.toolTip.ngOnDestroy();
      this.toolTip = undefined;
    }
  }
}
