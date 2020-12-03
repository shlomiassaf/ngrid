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
  Injector,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Platform } from '@angular/cdk/platform';
import { _DisposeViewRepeaterStrategy, _ViewRepeater, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import { CDK_TABLE_TEMPLATE, CdkTable, DataRowOutlet, CdkHeaderRowDef, CdkFooterRowDef, RowContext, CDK_TABLE, _COALESCED_STYLE_SCHEDULER, _CoalescedStyleScheduler, RenderRow } from '@angular/cdk/table';
import { Directionality } from '@angular/cdk/bidi';

import { PblNgridComponent } from '../ngrid.component';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { BypassCellRenderDisposeViewRepeaterStrategy } from './bypass-cdk-cell rendering-repeater-strategy';

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
  host: { // tslint:disable-line: no-host-metadata-property
    'class': 'pbl-cdk-table',
  },
  providers: [
    {provide: CDK_TABLE, useExisting: PblCdkTableComponent},
    // TODO: Remove when and if PR https://github.com/angular/components/pull/20765 is accepted and support for
    //       CDK version is dropped for those versions without the fix in 20765
    {provide: _VIEW_REPEATER_STRATEGY, useClass: BypassCellRenderDisposeViewRepeaterStrategy},
    {provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler},
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

  readonly cdRef: ChangeDetectorRef;

  private _minWidth: number | null = null;
  private beforeRenderRows$: Subject<void>;
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
              @Inject(EXT_API_TOKEN) protected extApi: PblNgridInternalExtensionApi<T>,
              @Inject(DOCUMENT) _document: any,
              platform: Platform,
              @Inject(_VIEW_REPEATER_STRATEGY) _viewRepeater: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
              @Inject(_COALESCED_STYLE_SCHEDULER) _coalescedStyleScheduler: _CoalescedStyleScheduler) {
    super(_differs, _changeDetectorRef, _elementRef, role, _dir, _document, platform, _viewRepeater, _coalescedStyleScheduler);
    this.cdRef = _changeDetectorRef;
    extApi.setCdkTable(this);
    this.trackBy = this.grid.trackBy;

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
