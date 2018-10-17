import {
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  Input,
  NgZone,
  ViewContainerRef,
} from '@angular/core';

import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Platform} from '@angular/cdk/platform';
import { TooltipPosition, MatTooltipDefaultOptions, MatTooltip, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

import { SgTableComponent, SgTablePluginController, TablePlugin, KillOnDestroy, SgTableConfigService } from '@sac/table';
import { SgTableCellEvent } from '@sac/table/target-events';

declare module '@sac/table/lib/table/services/config' {
  interface SgTableConfig {
    cellTooltip?: CellTooltipOptions & {
      /** When set to true will apply the default cell tooltip to ALL tables */
      autoSetAll?: boolean;
    };
  }
}

declare module '@sac/table/lib/ext/types' {
  interface SgTablePluginExtension {
    cellTooltip?: SgTableCellTooltipDirective<any>;
  }
  interface SgTablePluginExtensionFactories {
    cellTooltip: keyof typeof SgTableCellTooltipDirective;
  }
}

const PLUGIN_KEY: 'cellTooltip' = 'cellTooltip';

const DEFAULT_OPTIONS: CellTooltipOptions = {
  canShow: (event: SgTableCellEvent<any>): boolean => {
    const element = (event.cellTarget.firstElementChild || event.cellTarget) as HTMLElement;
    return element.scrollWidth > element.offsetWidth;
  },
  message: (event: SgTableCellEvent<any>): string => {
    return event.cellTarget.innerText;
  }
};

export interface CellTooltipOptions {
  canShow?: (event: SgTableCellEvent<any>) => boolean;
  message?: (event: SgTableCellEvent<any>) => string;
}

@TablePlugin({ id: PLUGIN_KEY, factory: 'create' })
@Directive({ selector: '[cellTooltip]', exportAs: 'sgOverflowTooltip' })
@KillOnDestroy()
export class SgTableCellTooltipDirective<T> implements CellTooltipOptions, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('cellTooltip') canShow: (event: SgTableCellEvent<T>) => boolean;
  @Input() message: (event: SgTableCellEvent<T>) => string;

  /** See Material docs for MatTooltip */
  @Input() position: TooltipPosition;
  /** See Material docs for MatTooltip */
  @Input() tooltipClass: string|string[]|Set<string>|{[key: string]: any};
  /** See Material docs for MatTooltip */
  @Input() showDelay: number;
  /** See Material docs for MatTooltip */
  @Input() hideDelay: number;

  private initArgs: [ Overlay, ElementRef<any>, ScrollDispatcher, ViewContainerRef, NgZone, Platform, AriaDescriber, FocusMonitor, any, Directionality, MatTooltipDefaultOptions ];

  private toolTip: MatTooltip;
  private lastConfig: CellTooltipOptions;
  private _removePlugin: (table: SgTableComponent<any>) => void;

  constructor(private table: SgTableComponent<any>, private injector: Injector, pluginCtrl: SgTablePluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    const configService = injector.get(SgTableConfigService);

    this.initArgs = [
      injector.get(Overlay),
      null,
      injector.get(ScrollDispatcher),
      injector.get(ViewContainerRef),
      injector.get(NgZone),
      injector.get(Platform),
      injector.get(AriaDescriber),
      injector.get(FocusMonitor),
      injector.get(MAT_TOOLTIP_SCROLL_STRATEGY),
      injector.get(Directionality),
      injector.get(MAT_TOOLTIP_DEFAULT_OPTIONS),
    ];

    configService.onUpdate('cellTooltip')
      .pipe(KillOnDestroy(this))
      .subscribe( cfg => this.lastConfig = cfg.curr );

    if (table.isInit) {
      this.init(pluginCtrl);
    } else {
      let subscription = pluginCtrl.events
        .subscribe( event => {
          if (event.kind === 'onInit') {
            this.init(pluginCtrl);
            subscription.unsubscribe();
            subscription = undefined;
          }
        });
    }
  }

  static create<T = any>(table: SgTableComponent<any>, injector: Injector): SgTableCellTooltipDirective<T> {
    return new SgTableCellTooltipDirective<T>(table, injector, SgTablePluginController.find(table));
  }

  ngOnDestroy(): void {
    this._removePlugin(this.table);
    this.killTooltip();
  }

  private init(pluginCtrl: SgTablePluginController): void {
    // Depends on target-events plugin
    // if it's not set, create it.
    const targetEventsPlugin = pluginCtrl.getPlugin('targetEvents') || pluginCtrl.createPlugin('targetEvents');
    targetEventsPlugin.cellEnter
      .pipe(KillOnDestroy(this))
      .subscribe( event => this.cellEnter(event) );

      targetEventsPlugin.cellLeave
      .pipe(KillOnDestroy(this))
      .subscribe( event => this.cellLeave(event) );
  }

  private cellEnter(event: SgTableCellEvent<T>): void {
    this.killTooltip();

    const canShow = this.canShow || (this.lastConfig && this.lastConfig.canShow) || DEFAULT_OPTIONS.canShow;
    if (canShow(event)) {
      const params = this.initArgs.slice() as SgTableCellTooltipDirective<any>['initArgs'];
      params[1] = new ElementRef<any>(event.cellTarget);

      // TODO TODO TODO
      // When moving to TS 3+ use spread in constructor signature
      // SEE https://github.com/Microsoft/TypeScript/wiki/What%27s-new-in-TypeScript#tuples-in-rest-parameters-and-spread-expressions
      // CODE:
      // this.toolTip = new MatTooltip(...params);
      this.toolTip = new MatTooltip(
        params[0],
        params[1],
        params[2],
        params[3],
        params[4],
        params[5],
        params[6],
        params[7],
        params[8],
        params[9],
        params[10],
      );

      const message = this.message || (this.lastConfig && this.lastConfig.message) || DEFAULT_OPTIONS.message;
      this.toolTip.message = message(event);

      if (this.position) {
        this.toolTip.position = this.position;
      }
      if (this.tooltipClass) {
        this.toolTip.tooltipClass = this.tooltipClass;
      }
      if (this.showDelay >= 0) {
        this.toolTip.showDelay = this.showDelay;
      }
      if (this.hideDelay >= 0) {
        this.toolTip.hideDelay = this.hideDelay;
      }
      this.toolTip.show();
    }
  }

  private cellLeave(event: SgTableCellEvent<T>): void {
    this.killTooltip();
  }

  private killTooltip(): void {
    if (this.toolTip) {
      this.toolTip.hide();
      this.toolTip.ngOnDestroy();
      this.toolTip = undefined;
    }
  }
}
