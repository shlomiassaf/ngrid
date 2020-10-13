import { Observable, Subject } from 'rxjs';

import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  ElementRef,
  EmbeddedViewRef,
  IterableDiffers,
  OnDestroy,
  Optional,
  ViewEncapsulation,
  ViewContainerRef,
  Injector,
  NgZone,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Platform } from '@angular/cdk/platform';
import { CDK_TABLE_TEMPLATE, CdkTable, DataRowOutlet, CdkHeaderRowDef, CdkFooterRowDef, RowContext, CDK_TABLE, _COALESCED_STYLE_SCHEDULER, _CoalescedStyleScheduler, RenderRow } from '@angular/cdk/table';
import { Directionality } from '@angular/cdk/bidi';

import { PblNgridComponent } from '../ngrid.component';
import { PblNgridExtensionApi, EXT_API_TOKEN } from '../../ext/grid-ext-api';
import { PblNgridColumnDef } from '../directives/column-def';
import { PblVirtualScrollForOf } from '../features/virtual-scroll/virtual-scroll-for-of';
import { _DisposeViewRepeaterStrategy, _ViewRepeater, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import { _TempDisposeViewRepeaterStrategy } from './cdk-20765-temp-workaround';

/**
 * Wrapper for the CdkTable that extends it's functionality to support various table features.
 * This wrapper also applies Material Design table styles (i.e. `MatTable` styles).
 *
 * Most of the extensions are done using mixins, this is mostly for clarity and separation of the features added.
 * This approach will allow easy removal when a feature is no longer required/implemented natively.
 */
@Component({
  selector: 'pbl-cdk-table',
  exportAs: 'pblCdkTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['./pbl-cdk-table.component.scss'],
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'pbl-cdk-table',
  },
  providers: [
    {provide: CDK_TABLE, useExisting: PblCdkTableComponent},
    {provide: _VIEW_REPEATER_STRATEGY, useClass: _TempDisposeViewRepeaterStrategy},
    {provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler},
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PblCdkTableComponent<T> extends CdkTable<T> implements OnDestroy {

  get _element(): HTMLElement { return this._elementRef.nativeElement; }

  get onRenderRows(): Observable<DataRowOutlet> {
    if (!this.onRenderRows$) {
      this.onRenderRows$ = new Subject<DataRowOutlet>();
    }
    return this.onRenderRows$.asObservable();
  }

  get minWidth(): number | null { return this._minWidth; }
  set minWidth(value: number | null) {
    this._minWidth = value || null;
    this._element.style.minWidth = value ? value + 'px' : null;
  }

  private _minWidth: number | null = null;
  private onRenderRows$: Subject<DataRowOutlet>;
  private _lastSticky: PblNgridColumnDef;
  private _lastStickyEnd: PblNgridColumnDef;
  private _isStickyPending: boolean;

  constructor(_differs: IterableDiffers,
              _changeDetectorRef: ChangeDetectorRef,
              _elementRef: ElementRef<HTMLElement>,
              @Attribute('role') role: string,
              @Optional() _dir: Directionality,
              protected injector: Injector,
              protected grid: PblNgridComponent<T>,
              @Inject(EXT_API_TOKEN) protected extApi: PblNgridExtensionApi<T>,
              @Inject(DOCUMENT) _document: any,
              platform: Platform,
              @Inject(_VIEW_REPEATER_STRATEGY) _viewRepeater: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
              @Inject(_COALESCED_STYLE_SCHEDULER) _coalescedStyleScheduler: _CoalescedStyleScheduler) {
    super(_differs, _changeDetectorRef, _elementRef, role, _dir, _document, platform, _viewRepeater, _coalescedStyleScheduler);
    this.grid._cdkTable = this;
    this.trackBy = this.grid.trackBy;

    (_viewRepeater as _TempDisposeViewRepeaterStrategy<T, RenderRow<T>, RowContext<T>>).init(this);

    extApi.events.subscribe( e => {
      if (e.kind === 'beforeInvalidateHeaders') {
        if (this._lastSticky) {
          this._lastSticky.queryCellElements('header', 'table', 'footer')
            .forEach( el => el.classList.remove('pbl-ngrid-sticky-start'));
          this._lastSticky = undefined;
        }
        if (this._lastStickyEnd) {
          this._lastStickyEnd.queryCellElements('header', 'table', 'footer')
            .forEach( el => el.classList.remove('pbl-ngrid-sticky-end'));
          this._lastStickyEnd = undefined;
        }
      }
    });
  }

  updateStickyColumnStyles() {
    if (this._isStickyPending) {
      return;
    }

    this._isStickyPending = true;
    Promise.resolve()
      .then( () => {
        this._isStickyPending = false;
        this._updateStickyColumnStyles();
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.onRenderRows$) {
      this.onRenderRows$.complete();
    }
    this.virtualScrollDestroy();
  }

  //#region CSS-CLASS-CONTROL
  addClass(cssClassName: string): void {
    this._element.classList.add(cssClassName);
  }

  removeClass(cssClassName: string): void {
    this._element.classList.remove(cssClassName);
  }
  //#endregion CSS-CLASS-CONTROL

  //#region CLEAR-ROW-DEFS

  // TODO: remove if https://github.com/angular/material2/pull/13000 is pushed
  private _cachedRowDefs = { header: new Set<CdkHeaderRowDef>(), footer: new Set<CdkFooterRowDef>() }; //tslint:disable-line

  // TODO: remove if https://github.com/angular/material2/pull/13000 is pushed
  addHeaderRowDef(headerRowDef: CdkHeaderRowDef): void {
    super.addHeaderRowDef(headerRowDef);
    this._cachedRowDefs.header.add(headerRowDef);
  }

  // TODO: remove if https://github.com/angular/material2/pull/13000 is pushed
  clearHeaderRowDefs(): void {
    const { header } = this._cachedRowDefs;
    for (const rowDef of Array.from(header.values())) {
      this.removeHeaderRowDef(rowDef);
    }
    header.clear();
  }

  // TODO: remove if https://github.com/angular/material2/pull/13000 is pushed
  addFooterRowDef(footerRowDef: CdkFooterRowDef): void {
    super.addFooterRowDef(footerRowDef);
    this._cachedRowDefs.footer.add(footerRowDef);
  }

  // TODO: remove if https://github.com/angular/material2/pull/13000 is pushed
  clearFooterRowDefs(): void {
    const { footer } = this._cachedRowDefs;
    for (const rowDef of Array.from(footer.values())) {
      this.removeFooterRowDef(rowDef);
    }
    footer.clear();
  }
  //#endregion CLEAR-ROW-DEFS

  //#region VIRTUAL-SCROLL
  private forOf: PblVirtualScrollForOf<T>; //tslint:disable-line

  attachViewPort(): void {
    this.detachViewPort();
    this.forOf = new PblVirtualScrollForOf<T>(this.extApi, this.injector.get(NgZone));
  }

  detachViewPort(): void {
    if (this.forOf) {
      this.forOf.destroy();
      this.forOf = undefined;
    }
  }

  private virtualScrollDestroy(): void {
    super.ngOnDestroy();
    this.detachViewPort();
  }
  //#endregion VIRTUAL-SCROLL

  /**
   * An alias for `_cacheRowDefs()`
   */
  updateRowDefCache(): void {
    (this as any)._cacheRowDefs();
  }

  renderRows(): void {
    super.renderRows();

    // The problem of inheritance right at your face
    // Because material does not allow us to control the context generation for a row we need to get clever.
    // https://github.com/angular/components/issues/14199
    // TODO: If they do allow controlling context generation, remove this and apply their solution.
    const viewContainer = this._rowOutlet.viewContainer;
    for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
      const viewRef = viewContainer.get(renderIndex) as EmbeddedViewRef<RowContext<T>>;
      const context = viewRef.context;
      context.gridInstance = this.grid;
    }

    if (this.onRenderRows$) {
      this.onRenderRows$.next(this._rowOutlet);
    }
  }

  /**
   * Force run change detection for rows.
   * You can run it for specific groups or for all rows.
   */
  syncRows(rowType?: 'all' | boolean, detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer' | 'all' | boolean = false, ...rows: any[]): void {
    const detectChanges: boolean = typeof rowType === 'boolean'
      ? rowType
      : typeof rows[0] === 'boolean'
        ? rows.shift()
        : false
    ;

    let vcRef: ViewContainerRef;
    switch(rowType) {
      case 'header':
        vcRef = this._headerRowOutlet.viewContainer;
        break;
      case 'data':
        vcRef = this._rowOutlet.viewContainer;
        break;
      case 'footer':
        vcRef = this._footerRowOutlet.viewContainer;
        break;
      default: // boolean or 'all'
        this._changeDetectorRef.markForCheck();
        if (detectChanges) {
          this._changeDetectorRef.detectChanges();
        }
        return;
    }

    const useSpecificRows = rows.length > 0;
    const count = useSpecificRows ? rows.length : vcRef.length;

    for (let renderIndex = 0; renderIndex < count; renderIndex++) {
      const viewRef = vcRef.get(useSpecificRows ? rows[renderIndex] : renderIndex) as EmbeddedViewRef<any>;
      if (viewRef) {
        viewRef.markForCheck();
        if (detectChanges) {
          viewRef.detectChanges();
        }
      }
    }
  }

  pblForceRenderDataRows(): void {
    try{
      (this as any)._forceRenderDataRows();
    } catch (ex) {
      this.multiTemplateDataRows = this.multiTemplateDataRows;
    }
  }

  private _updateStickyColumnStyles() {
    const columns = this.grid.columnApi.visibleColumns;
    let sticky: PblNgridColumnDef, stickyEnd: PblNgridColumnDef;

    for (let i = 0, len = columns.length; i < len; i++) {
      if (columns[i].columnDef && columns[i].columnDef.sticky) {
        sticky = columns[i].columnDef;
      }
    }

    for (let i = columns.length - 1; i > -1; i--) {
      if (columns[i].columnDef && columns[i].columnDef.stickyEnd) {
        stickyEnd = columns[i].columnDef;
      }
    }

    if (this._lastSticky) {
      this._lastSticky.queryCellElements('header', 'table', 'footer')
        .forEach( el => el.classList.remove('pbl-ngrid-sticky-start'));
    }

    if (sticky) {
      sticky.queryCellElements('header', 'table', 'footer')
        .forEach( el => el.classList.add('pbl-ngrid-sticky-start'));
    }
    this._lastSticky = sticky;

    if (this._lastStickyEnd) {
      this._lastStickyEnd.queryCellElements('header', 'table', 'footer')
        .forEach( el => el.classList.remove('pbl-ngrid-sticky-end'));
    }

    if (stickyEnd) {
      stickyEnd.queryCellElements('header', 'table', 'footer')
        .forEach( el => el.classList.add('pbl-ngrid-sticky-end'));
    }
    this._lastStickyEnd = stickyEnd;

    super.updateStickyColumnStyles();
  }
}
