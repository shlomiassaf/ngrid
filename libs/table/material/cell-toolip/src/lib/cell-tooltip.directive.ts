import { first } from 'rxjs/operators';
import {
  Directive,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  Input,
  NgZone,
  Optional,
  ViewContainerRef,
} from '@angular/core';

import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Platform} from '@angular/cdk/platform';
import { TooltipPosition, MatTooltipDefaultOptions, MatTooltip, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';

import { SgTableComponent, KillOnDestroy, SgTableExternalPluginService, SgTableConfigService } from '@sac/table';
import { SgTableTargetEventsPlugin, SgTableCellEvent } from '@sac/table/target-events';

declare module '@sac/table/lib/table/services/config' {
  interface SgTableConfig {
    cellTooltip?: CellTooltipOptions;
  }
}

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

@Directive({ selector: '[cellTooltip]', exportAs: 'sgOverflowTooltip' })
@KillOnDestroy()
export class SgTableCellTooltipDirective<T> implements CellTooltipOptions, OnDestroy {

  @Input() canShow: (event: SgTableCellEvent<T>) => boolean;
  @Input() message: (event: SgTableCellEvent<T>) => string;

  /** See Material docs for MatTooltip */
  @Input() position: TooltipPosition;
  /** See Material docs for MatTooltip */
  @Input() tooltipClass: string|string[]|Set<string>|{[key: string]: any};
  /** See Material docs for MatTooltip */
  @Input() showDelay: number;
  /** See Material docs for MatTooltip */
  @Input() hideDelay: number;

  private initArgs: {
    overlay: Overlay;
    scrollDispatcher: ScrollDispatcher;
    viewContainerRef: ViewContainerRef;
    ngZone: NgZone;
    platform: Platform;
    ariaDescriber: AriaDescriber;
    focusMonitor: FocusMonitor;
    scrollStrategy: any;
    dir: Directionality;
    defaultOptions: MatTooltipDefaultOptions;
  };

  private toolTip: MatTooltip;
  private lastConfig: CellTooltipOptions;

  constructor(public table: SgTableComponent<any>, config: SgTableConfigService, extPlugins: SgTableExternalPluginService, injector: Injector,
              overlay: Overlay,
              scrollDispatcher: ScrollDispatcher,
              viewContainerRef: ViewContainerRef,
              ngZone: NgZone,
              platform: Platform,
              ariaDescriber: AriaDescriber,
              focusMonitor: FocusMonitor,
              @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) scrollStrategy: any,
              @Optional() dir: Directionality,
              @Optional() @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS) defaultOptions: MatTooltipDefaultOptions) {
    this.initArgs = {
      overlay,
      scrollDispatcher,
      viewContainerRef,
      ngZone,
      platform,
      ariaDescriber,
      focusMonitor,
      scrollStrategy,
      dir,
      defaultOptions,
    };

    config.onUpdate('cellTooltip')
      .pipe(KillOnDestroy(this))
      .subscribe( cfg => this.lastConfig = cfg.curr );

    let subscription = table.pluginEvents.subscribe( event => {
      if (event.kind === 'onInit') {
        subscription.unsubscribe();
        subscription = undefined;

        // Depends on target-events plugin
        // if it's not set, create it.
        // TODO: this is not optimal.... life cycle events are out of sync, if needed.
        extPlugins.onNewTable.pipe(first()).subscribe( t => {
          if (!t.plugin('targetEvents')) {
            const targetEvents = new SgTableTargetEventsPlugin<T>(table, injector);
            event.registerPlugin('targetEvents', targetEvents);
            targetEvents.init();
          }
          this.init(t.plugin('targetEvents'));
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.killTooltip();
  }

  private init(targetEvents: SgTableTargetEventsPlugin<T>): void {
    targetEvents.cellEnter
      .pipe(KillOnDestroy(this))
      .subscribe( event => this.cellEnter(event) );

    targetEvents.cellLeave
      .pipe(KillOnDestroy(this))
      .subscribe( event => this.cellLeave(event) );
  }

  private cellEnter(event: SgTableCellEvent<T>): void {
    this.killTooltip();

    const canShow = this.canShow || (this.lastConfig && this.lastConfig.canShow) || DEFAULT_OPTIONS.canShow;

    if (canShow(event)) {
      const { overlay, scrollDispatcher, viewContainerRef, ngZone, platform, ariaDescriber, focusMonitor, scrollStrategy, dir, defaultOptions } = this.initArgs;
      this.toolTip = new MatTooltip(
        overlay,
        new ElementRef<any>(event.cellTarget),
        scrollDispatcher,
        viewContainerRef,
        ngZone,
        platform,
        ariaDescriber,
        focusMonitor,
        scrollStrategy,
        dir,
        defaultOptions,
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
