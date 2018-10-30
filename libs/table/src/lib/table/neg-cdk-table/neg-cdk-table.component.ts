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
import { CDK_TABLE_TEMPLATE, CdkTable, DataRowOutlet, CdkHeaderRowDef, CdkFooterRowDef } from '@angular/cdk/table';
import { Directionality } from '@angular/cdk/bidi';

import { NegTableComponent } from '../table.component';

import { NegVirtualScrollForOf } from '../features/virtual-scroll/virtual-scroll-for-of';
import { NegCdkVirtualScrollViewportComponent } from '../features/virtual-scroll/virtual-scroll-viewport.component';

/**
 * Wrapper for the CdkTable that extends it's functionality to support various table features.
 * This wrapper also applies Material Design table styles (i.e. `MatTable` styles).
 *
 * Most of the extensions are done using mixins, this is mostly for clarity and separation of the features added.
 * This approach will allow easy removal when a feature is no longer required/implemented natively.
 */
@Component({
  selector: 'neg-cdk-table',
  exportAs: 'negCdkTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['./neg-cdk-table.component.scss'],
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'neg-cdk-table',
    '[class.neg-table-margin-cell-box-model]': `isMarginSpace`
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NegCdkTableComponent<T> extends CdkTable<T> implements OnDestroy {

  protected get _element(): HTMLElement { return this._elementRef.nativeElement; }

  get onRenderRows(): Observable<DataRowOutlet> {
    if (!this.onRenderRows$) {
      this.onRenderRows$ = new Subject<DataRowOutlet>();
    }
    return this.onRenderRows$.asObservable();
  }

  get minWidth(): string | null { return this._minWidth; }
  set minWidth(value: string | null) {
    this._element.style.minWidth = this._minWidth = value || null;
  }

  get isMarginSpace(): boolean { return this.table.boxSpaceModel === 'margin'; }

  private _minWidth: string | null = null;

  private onRenderRows$: Subject<DataRowOutlet>;

  constructor(_differs: IterableDiffers,
              _changeDetectorRef: ChangeDetectorRef,
              _elementRef: ElementRef,
              @Attribute('role') role: string,
              @Optional() _dir: Directionality,
              protected injector: Injector,
              protected table: NegTableComponent<T>,
              @Inject(DOCUMENT) _document?: any,
              platform?: Platform) {
    super(_differs, _changeDetectorRef, _elementRef, role, _dir, document, platform);
    this.table._cdkTable = this;
    this.trackBy = this.table.trackBy;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.onRenderRows$) {
      this.onRenderRows$.complete();
    }
    this.virtualScrollDestroy();
  }

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
  private forOf: NegVirtualScrollForOf<T>; //tslint:disable-line

  updateStickyHeaderRowStyles(): void {
    super.updateStickyHeaderRowStyles();
    // if attached
    if (this.forOf) {
      // TODO: suggest exposing `_headerRowDefs` in material repp or try to get it's value (hint: clear-row-defs mixin)
      this.forOf.setMetaRows(
        this._getRenderedRows(this._headerRowOutlet),
        (this as any)._headerRowDefs.map(def => def.sticky),
        'top',
      );
    }
  }

  updateStickyFooterRowStyles(): void {
    super.updateStickyFooterRowStyles();
    // if attached
    if (this.forOf) {
      // TODO: suggest exposing `_footerRowDefs` in material repp or try to get it's value (hint: clear-row-defs mixin)
      this.forOf.setMetaRows(
        this._getRenderedRows(this._footerRowOutlet),
        (this as any)._footerRowDefs.map(def => def.sticky),
        'bottom',
      );
    }
  }

  attachViewPort(viewport: NegCdkVirtualScrollViewportComponent): void {
    this.detachViewPort();
    this.forOf = new NegVirtualScrollForOf<T>(this.table, this as any, viewport, this.injector.get(NgZone));
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
    if (this.onRenderRows$) {
      this.onRenderRows$.next(this._rowOutlet);
    }
  }

  /**
   * Force run change detection for rows.
   * You can run it for specific groups or for all rows.
   */
  syncRows(rowType?: 'all', detectChanges?: boolean): void;
  syncRows(rowType: 'header' | 'data' | 'footer', detectChanges: boolean, ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer', ...rows: number[]): void;
  syncRows(rowType: 'header' | 'data' | 'footer' | 'all' = 'all', ...rows: any[]): void {
    const detectChanges: boolean = typeof rows[0] === 'boolean' ? rows.shift() : false;

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
      default:
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
}
