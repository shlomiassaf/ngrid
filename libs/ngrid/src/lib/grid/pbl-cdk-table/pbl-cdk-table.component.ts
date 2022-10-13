import { Observable, Subject, of as observableOf, } from 'rxjs';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  ElementRef,
  IterableDiffers,
  OnDestroy,
  Optional,
  ViewEncapsulation,
  Injector,
  SkipSelf,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { _DisposeViewRepeaterStrategy, _ViewRepeater, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  CDK_TABLE_TEMPLATE,
  CdkTable,
  DataRowOutlet,
  CdkHeaderRowDef,
  CdkFooterRowDef,
  RowContext,
  CDK_TABLE,
  _COALESCED_STYLE_SCHEDULER,
  _CoalescedStyleScheduler,
  RenderRow,
  STICKY_POSITIONING_LISTENER,
  StickyPositioningListener,
  StickyStyler,
} from '@angular/cdk/table';
import { Direction, Directionality } from '@angular/cdk/bidi';

import { unrx } from '@pebula/ngrid/core';
import { PBL_NGRID_COMPONENT, _PblNgridComponent } from '../../tokens';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

import { PblNgridDisposedRowViewRepeaterStrategy } from './ngrid-disposed-row-view-repeater-strategy';
import { PblNgridCachedRowViewRepeaterStrategy } from './ngrid-cached-row-view-repeater-strategy';
import { PblNgridColumnDef } from '../column/directives';
import { PblColumn } from '../column/model';

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
  host: { // tslint:disable-line: no-host-metadata-property
    'class': 'pbl-cdk-table',
  },
  providers: [
    {provide: CDK_TABLE, useExisting: PblCdkTableComponent},
    {provide: _VIEW_REPEATER_STRATEGY, useClass: PblNgridCachedRowViewRepeaterStrategy},
    {provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler},
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    {provide: STICKY_POSITIONING_LISTENER, useValue: null},
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PblCdkTableComponent<T> extends CdkTable<T> implements OnDestroy {

  get _element(): HTMLElement { return this._elementRef.nativeElement; }

  get beforeRenderRows(): Observable<void> {
    if (!this.beforeRenderRows$) {
      this.beforeRenderRows$ = new Subject<void>();
    }
    return this.beforeRenderRows$.asObservable();
  }

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

  get stickyActive(): boolean { return this._stickyActive; }

  readonly cdRef: ChangeDetectorRef;

  private _stickyActive: boolean = false;
  private _minWidth: number | null = null;
  private beforeRenderRows$: Subject<void>;
  private onRenderRows$: Subject<DataRowOutlet>;
  private _isStickyPending: boolean;
  private pblStickyStyler: StickyStyler;
  private pblStickyColumnStylesNeedReset = false;

  constructor(_differs: IterableDiffers,
              _changeDetectorRef: ChangeDetectorRef,
              _elementRef: ElementRef<HTMLElement>,
              @Attribute('role') role: string,
              @Optional() _dir: Directionality,
              protected injector: Injector,
              @Inject(PBL_NGRID_COMPONENT) protected grid: _PblNgridComponent<T>,
              @Inject(EXT_API_TOKEN) protected extApi: PblNgridInternalExtensionApi<T>,
              @Inject(DOCUMENT) _document: any,
              protected platform: Platform,
              @Inject(_VIEW_REPEATER_STRATEGY) _viewRepeater: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
              @Inject(_COALESCED_STYLE_SCHEDULER) _coalescedStyleScheduler: _CoalescedStyleScheduler,
              _viewportRuler: ViewportRuler,
              @Optional() @SkipSelf() @Inject(STICKY_POSITIONING_LISTENER) _stickyPositioningListener?: StickyPositioningListener) {
    super(_differs, _changeDetectorRef, _elementRef, role, _dir, _document, platform, _viewRepeater, _coalescedStyleScheduler, _viewportRuler, _stickyPositioningListener);

    this.cdRef = _changeDetectorRef;
    extApi.setCdkTable(this);
    this.trackBy = this.grid.trackBy;
  }

  ngOnInit(): void {
    // We implement our own sticky styler because we don't have access to the one at CdkTable (private)
    // We need it because our CdkRowDef classes does not expose columns, it's always an empty array
    // This is to prevent CdkTable from rendering cells, we do that.
    // This is why the styler will not work on columns, cause internall in CdkTable it sees nothing.
    this.pblStickyStyler = new StickyStyler(this._isNativeHtmlTable,
                                            this.stickyCssClass,
                                            this._dir?.value || 'ltr',
                                            this._coalescedStyleScheduler,
                                            this.platform.isBrowser,
                                            this.needsPositionStickyOnElement,
                                            this._stickyPositioningListener);

    // This will also run from CdkTable and `updateStickyColumnStyles()` is invoked multiple times
    // but we don't care, we have a window
    (this._dir?.change ?? observableOf<Direction>())
      .pipe(unrx(this))
      .subscribe(value => {
        this.pblStickyStyler.direction = value;
        this.pblStickyColumnStylesNeedReset = true;
        this.updateStickyColumnStyles();
      });

    // It's imperative we register to dir changes before super.ngOnInit because it register there as well
    // and it will come first and make sticky state pending, cancelling our pblStickyStyler.
    super.ngOnInit();
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
    unrx.kill(this);
    if (this.onRenderRows$) {
      this.onRenderRows$.complete();
    }
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

  /**
   * An alias for `_cacheRowDefs()`
   */
  updateRowDefCache(): void {
    (this as any)._cacheRowDefs();
  }

  renderRows(): void {
    if (this.beforeRenderRows$) {
      this.beforeRenderRows$.next();
    }
    super.renderRows();
    if (this.onRenderRows$) {
      this.onRenderRows$.next(this._rowOutlet);
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
    // We let the parent do the work on rows, it will see 0 columns so then we act.
    super.updateStickyColumnStyles();

    let stickyActive = false;
    const stickyStartStates: boolean[] = [];
    const stickyEndStates: boolean[] = [];
    for (const c of this.extApi.columnApi.visibleColumns)
    {
      const sticky = c.columnDef?.sticky;
      const stickyEnd = c.columnDef?.stickyEnd;

      stickyStartStates.push(!!sticky);
      stickyEndStates.push(!!stickyEnd);

      if (!stickyActive && (sticky || stickyEnd)) {
        stickyActive = true;
      }
    }

    if (stickyActive != this._stickyActive)
    {
      if (this._stickyActive = stickyActive) {
        this.grid.addClass("pbl-ngrid-sticky-active");
      } else {
        this.grid.removeClass("pbl-ngrid-sticky-active");
      }
    }

    const headerRow = this.extApi.rowsApi.findColumnRow('header');
    const footerRow = this.extApi.rowsApi.findColumnRow('footer');
    const rows = this.extApi.rowsApi.dataRows().map(r => r.element);
    if (headerRow) {
      rows.unshift(headerRow.element);
    }
    if (footerRow) {
      rows.push(footerRow.element);
    }

    if (!this.pblStickyColumnStylesNeedReset) {
      const stickyCheckReducer = (acc, d: PblNgridColumnDef<PblColumn>) => {
          return acc || (d?.hasStickyChanged() ?? false);
      };

      this.pblStickyColumnStylesNeedReset = this.extApi.columnApi.columns.map(c => c.columnDef).reduce(stickyCheckReducer, false);
    }
    
    // internal reset, coming from Dir change
    // It will probably get added to CDK ask well, remove when addedd
    if (this.pblStickyColumnStylesNeedReset) {
      this.pblStickyStyler.clearStickyPositioning(rows, ['left', 'right']);
      this.pblStickyColumnStylesNeedReset = false;
    }

    this.pblStickyStyler.updateStickyColumns(rows, stickyStartStates, stickyEndStates, true);

    // Reset the dirty state of the sticky input change since it has been used.
    this.extApi.columnApi.columns.forEach(c => c.columnDef?.resetStickyChanged());
  }

}
