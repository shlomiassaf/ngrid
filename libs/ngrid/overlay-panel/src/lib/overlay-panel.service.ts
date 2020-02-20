import { Injectable, ViewContainerRef, ElementRef, Injector, EmbeddedViewRef, TemplateRef } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import {
  FlexibleConnectedPositionStrategy,
  HorizontalConnectionPos,
  Overlay,
  OverlayConfig,
  OverlayRef,
  VerticalConnectionPos,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
import { RowContext } from '@angular/cdk/table';
import { PblNgridPluginController, PblNgridComponent, PblNgridMultiTemplateRegistry } from '@pebula/ngrid';

import { PblNgridOverlayPanelComponentExtension } from './component-registry-extension';
import { PblNgridOverlayPanelRef } from './overlay-panel-ref';
import { PblNgridOverlayPanelContext } from './overlay-panel-def';

declare module '@pebula/ngrid/lib/grid/services/grid-registry.service' {
  interface PblNgridMultiRegistryMap {
    overlayPanels?:
      | PblNgridMultiTemplateRegistry<any, 'overlayPanels'>
      | PblNgridOverlayPanelComponentExtension<any>;
  }
}

export interface PblNgridOverlayPanelConfig {
  hasBackdrop?: boolean;
  backdropClass?: string;
  xPos?: 'before' | 'center' | 'after';
  yPos?: 'above' | 'center' | 'below';
  insetPos?: boolean;
}

const DEFAULT_OVERLAY_PANEL_CONFIG: PblNgridOverlayPanelConfig = {
  hasBackdrop: false,
  xPos: 'center',
  yPos: 'center',
  insetPos: false,
};

@Injectable()
export class PblNgridOverlayPanelFactory {
  constructor(private _overlay: Overlay, private _dir: Directionality) { }

  create<T>(grid: PblNgridComponent<T>): PblNgridOverlayPanel<T> {
    return new PblNgridOverlayPanel<T>(this._overlay, this._dir, grid);
  }
}

export class PblNgridOverlayPanel<T = any> {

  private vcRef: ViewContainerRef;
  private injector: Injector;
  private _scrollStrategy: () => ScrollStrategy;

  constructor(private _overlay: Overlay,
              private _dir: Directionality,
              public readonly grid: PblNgridComponent<T>) {
    const controller = PblNgridPluginController.find(grid);
    this.injector = controller.injector;
    this.vcRef = controller.injector.get(ViewContainerRef);
    this._scrollStrategy = () => _overlay.scrollStrategies.reposition();
  }


  /**
   * Opens a panel relative to a cell element using the overlay panel extension registry template/component with the name provided in `extName`.
   * The cell element is referenced by the `columnId` and the `rowRenderPosition`.
   *
   * If the `rowRenderPosition` is "header" or "footer" then the grid's header / footer rows are targeted, otherwise the number provided should reference
   * the rendered row index to use to get the cell from.
   *
   * > Note that this helper method does not allow targeting meta cells.
   */
  openGridCell<T = any>(extName: string, columnId: string, rowRenderPosition: number | 'header' | 'footer', config?: PblNgridOverlayPanelConfig, data?: T): PblNgridOverlayPanelRef<T> {
    const column = this.grid.columnApi.findColumn(columnId);
    if (!column) {
      throw new Error('Could not find the column ' + columnId);
    }

    let section: 'table' | 'header' | 'footer';
    let rowRenderIndex = 0;
    switch (rowRenderPosition) {
      case 'header':
      case 'footer':
        section = rowRenderPosition;
        break;
      default:
        if (typeof rowRenderPosition === 'number') {
          section = 'table';
          rowRenderIndex = rowRenderPosition;
        }
        break;
    }

    if (!section) {
      throw new Error('Invalid "rowRenderPosition" provided, use "header", "footer" or any number >= 0.');
    }

    const el = column && column.columnDef.queryCellElements(section)[rowRenderIndex];
    if (!el) {
      throw new Error(`Could not find a cell for the column ${columnId} at render index ${rowRenderIndex}`);
    }

    return this.open(extName, new ElementRef(el), config, data);
  }

  open<T = any>(extName: string, source: ElementRef<HTMLElement>, config?: PblNgridOverlayPanelConfig, data?: T): PblNgridOverlayPanelRef<T> {
    config = Object.assign({ ...DEFAULT_OVERLAY_PANEL_CONFIG }, config || {});
    const match = this.findNamesExtension(extName);

    if (!match) {
      throw new Error('Could not find the overlay panel with the name ' + extName);
    }

    const overlayRef = this._createOverlay(source, config);
    const overlayPanelRef = new PblNgridOverlayPanelRef(overlayRef, data);
    this._setPosition(overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy, config);

    if (match instanceof PblNgridMultiTemplateRegistry) {
      const tPortal = this._getTemplatePortal(match.tRef, overlayPanelRef);
      const viewRef = overlayRef.attach(tPortal);
      viewRef.markForCheck();
      viewRef.detectChanges();
    } else {
      const cPortal = this._getComponentPortal(overlayPanelRef, match)
      const cmpRef = overlayRef.attach(cPortal);
      match.onCreated(null, cmpRef);
    }

    overlayRef.updatePosition();
    return overlayPanelRef;
  }

  /**
   * This method creates the overlay from the provided menu's template and saves its
   * OverlayRef so that it can be attached to the DOM when openMenu is called.
   */
  private _createOverlay(element: ElementRef<HTMLElement>, config: PblNgridOverlayPanelConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(element, config);
    const overlayRef = this._overlay.create(overlayConfig);
    overlayRef.getConfig().hasBackdrop = !!config.hasBackdrop
    // Consume the `keydownEvents` in order to prevent them from going to another overlay.
    // Ideally we'd also have our keyboard event logic in here, however doing so will
    // break anybody that may have implemented the `MatMenuPanel` themselves.
    overlayRef.keydownEvents().subscribe();

    return overlayRef;
  }

  /**
   * This method builds the configuration object needed to create the overlay, the OverlayState.
   * @returns OverlayConfig
   */
  private _getOverlayConfig(element: ElementRef<HTMLElement>, config: PblNgridOverlayPanelConfig): OverlayConfig {
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(element)
      .withLockedPosition();

    return new OverlayConfig({
      positionStrategy,
      backdropClass: config.backdropClass || 'cdk-overlay-transparent-backdrop', // TODO: don't use the cdk's class, create it
      scrollStrategy: this._scrollStrategy(),
      direction: this._dir
    });
  }

  private _getTemplatePortal(tRef: TemplateRef<PblNgridOverlayPanelContext>, overlayPanelRef: PblNgridOverlayPanelRef) {
    const context: PblNgridOverlayPanelContext = {
      grid: this.grid,
      ref: overlayPanelRef,
    };
    return new TemplatePortal(tRef, this.vcRef, context);
  }

  private _getComponentPortal(overlayPanelRef: PblNgridOverlayPanelRef,
                              componentExtension: PblNgridOverlayPanelComponentExtension<any>) {
    const portalInjector = Injector.create({
      providers: [
        { provide: PblNgridOverlayPanelRef, useValue: overlayPanelRef },
      ],
      parent: componentExtension.injector || this.injector,
    });
    return new ComponentPortal(componentExtension.component, this.vcRef, portalInjector, componentExtension.cfr || null)
  }

  private _setPosition(positionStrategy: FlexibleConnectedPositionStrategy, config: PblNgridOverlayPanelConfig) {
    let [originX, originFallbackX]: HorizontalConnectionPos[] =
      config.xPos === 'center'
        ? ['center', 'center']
        : config.xPos === 'before' ? ['end', 'start'] : ['start', 'end'];

    let [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
      config.yPos === 'center'
        ? ['center', 'center']
        : config.yPos === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

    let [originY, originFallbackY] = [overlayY, overlayFallbackY];
    let [overlayX, overlayFallbackX] = [originX, originFallbackX];
    let offsetY = 0;

    if (!config.insetPos) {
      if (overlayY !== 'center') {
        originY = overlayY === 'top' ? 'bottom' : 'top';
      }
      if (overlayFallbackY !== 'center') {
        originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
      }
    }

    positionStrategy.withPositions([
      {originX, originY, overlayX, overlayY, offsetY},
      {originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY},
      {
        originX,
        originY: originFallbackY,
        overlayX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY
      },
      {
        originX: originFallbackX,
        originY: originFallbackY,
        overlayX: overlayFallbackX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY
      }
    ]);
  }

  private findNamesExtension(extName: string) {
    let match: PblNgridMultiTemplateRegistry<PblNgridOverlayPanelContext, 'overlayPanels'> | PblNgridOverlayPanelComponentExtension<any>;
    this.grid.registry.forMulti('overlayPanels', values => {
      for (const value of values) {
        if (value.name === extName) {
          match = value;
          return true;
        }
      }
    });
    return match;
  }
}


