import {
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  Input,
  NgZone,
  ViewContainerRef,
} from '@angular/core';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Platform} from '@angular/cdk/platform';
import { TooltipPosition, MatTooltipDefaultOptions, MatTooltip, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

import { UnRx } from '@neg/utils';
import { NegTableComponent, NegTablePluginController, TablePlugin, NegTableConfigService } from '@neg/table';
import { NegTableCellEvent } from '@neg/table/target-events';

declare module '@neg/table/lib/table/services/config' {
  interface NegTableConfig {
    cellTooltip?: CellTooltipOptions & {
      /** When set to true will apply the default cell tooltip to ALL tables */
      autoSetAll?: boolean;
    };
  }
}

declare module '@neg/table/lib/ext/types' {
  interface NegTablePluginExtension {
    cellTooltip?: NegTableCellTooltipDirective<any>;
  }
  interface NegTablePluginExtensionFactories {
    cellTooltip: keyof typeof NegTableCellTooltipDirective;
  }
}

const PLUGIN_KEY: 'cellTooltip' = 'cellTooltip';

const DEFAULT_OPTIONS: CellTooltipOptions = {
  canShow: (event: NegTableCellEvent<any>): boolean => {
    const element = (event.cellTarget.firstElementChild || event.cellTarget) as HTMLElement;
    return element.scrollWidth > element.offsetWidth;
  },
  message: (event: NegTableCellEvent<any>): string => {
    return event.cellTarget.innerText;
  }
};

export interface CellTooltipOptions {
  canShow?: boolean | ( (event: NegTableCellEvent<any>) => boolean );
  message?: (event: NegTableCellEvent<any>) => string;
}

@TablePlugin({ id: PLUGIN_KEY, factory: 'create' })
@Directive({ selector: '[cellTooltip]', exportAs: 'negOverflowTooltip' })
@UnRx()
export class NegTableCellTooltipDirective<T> implements CellTooltipOptions, OnDestroy {
  static readonly PLUGIN_KEY: 'cellTooltip' = PLUGIN_KEY;

  // tslint:disable-next-line:no-input-rename
  @Input('cellTooltip') set canShow(value: boolean | ( (event: NegTableCellEvent<T>) => boolean )) {
    if (typeof value === 'function') {
      this._canShow = value;
    } else if ( (value as any) === '') {
      this._canShow = undefined;
    } else {
      this._canShow = coerceBooleanProperty(value) ? e => true : e => false;
    }
  }

  @Input() message: (event: NegTableCellEvent<T>) => string;

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
  private _removePlugin: (table: NegTableComponent<any>) => void;
  private _canShow: (event: NegTableCellEvent<T>) => boolean;

  constructor(private table: NegTableComponent<any>, private injector: Injector, pluginCtrl: NegTablePluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    const configService = injector.get(NegTableConfigService);

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
      .pipe(UnRx(this))
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

  static create<T = any>(table: NegTableComponent<any>, injector: Injector): NegTableCellTooltipDirective<T> {
    return new NegTableCellTooltipDirective<T>(table, injector, NegTablePluginController.find(table));
  }

  ngOnDestroy(): void {
    this._removePlugin(this.table);
    this.killTooltip();
  }

  private init(pluginCtrl: NegTablePluginController): void {
    // Depends on target-events plugin
    // if it's not set, create it.
    const targetEventsPlugin = pluginCtrl.getPlugin('targetEvents') || pluginCtrl.createPlugin('targetEvents');
    targetEventsPlugin.cellEnter
      .pipe(UnRx(this))
      .subscribe( event => this.cellEnter(event) );

    targetEventsPlugin.cellLeave
      .pipe(UnRx(this))
      .subscribe( event => this.cellLeave(event) );
  }

  private cellEnter(event: NegTableCellEvent<T>): void {
    this.killTooltip();

    if (!this._canShow) {
      // TODO: this will set lastConfig / default option once
      // but if user changes lastConfig it will never update again...
      this.canShow = (this.lastConfig && this.lastConfig.canShow) || DEFAULT_OPTIONS.canShow;
    }

    if (this._canShow(event)) {
      const params = this.initArgs.slice() as NegTableCellTooltipDirective<any>['initArgs'];
      params[1] = new ElementRef<any>(event.cellTarget);

      this.toolTip = new MatTooltip(...params);

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

  private cellLeave(event: NegTableCellEvent<T>): void {
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
