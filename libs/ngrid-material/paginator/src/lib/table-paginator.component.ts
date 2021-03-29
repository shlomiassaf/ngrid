import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { deprecatedWarning, unrx } from '@pebula/ngrid/core';
import { PblNgridComponent, PblPaginator, PblPaginatorChangeEvent } from '@pebula/ngrid';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

@Component({
  selector: 'pbl-ngrid-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
  host: {
    'class': 'mat-paginator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PblPaginatorComponent implements OnDestroy {
  pages: number[] = [];
  pageSizes: number[] = DEFAULT_PAGE_SIZE_OPTIONS.slice();

  @Input() get pageSizeOptions(): number[] { return this._pageSizeOptions; }
  set pageSizeOptions(value: number[]) {
    this._pageSizeOptions = value;
    this.pageSizes = (value || DEFAULT_PAGE_SIZE_OPTIONS).slice();
    this.updatePageSizes();
  }

  @Input() get paginator(): PblPaginator<number> { return this._paginator; }
  set paginator(value: PblPaginator<number>) {
    if (this._paginator === value) {
      return;
    }
    if (this._paginator) {
      unrx.kill(this, this._paginator);
    }
    this._paginator = value;
    if (value) {
      // pagination.onChange is BehaviorSubject so handlePageChange will trigger
      value.onChange
        .pipe(unrx(this, value))
        .subscribe( event => this.handlePageChange(event) );
      this.updatePageSizes();
    }
  }

  /**
   * @deprecated Use `grid` instead, will be removed in version 4
   */
  @Input() get table(): PblNgridComponent<any> {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      deprecatedWarning('PblPaginatorComponent.table', '4', 'PblPaginatorComponent.grid');
    }
    return this.grid;
  }
  /**
   * @deprecated Use `grid` instead, will be removed in version 4
   */
  set table(value: PblNgridComponent<any>) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      console.warn(`"PblPaginatorComponent.table" is deprecated and will be removed in version 4, use "grid" instead.`)
    }
    this.grid = value;
  }

  @Input() grid: PblNgridComponent<any>;

  @Input() get hidePageSize(): boolean { return this._hidePageSize; }
  set hidePageSize(value: boolean) { this._hidePageSize = coerceBooleanProperty(value); }

  @Input() get hideRangeSelect(): boolean { return this._hideRangeSelect; }
  set hideRangeSelect(value: boolean) { this._hideRangeSelect = coerceBooleanProperty(value); }

  private _pageSizeOptions: number[];
  private _paginator: PblPaginator<number>;
  private _hidePageSize = false;
  private _hideRangeSelect = false;

  constructor(@Optional() grid: PblNgridComponent<any>,
              public _intl: MatPaginatorIntl,
              private cdr: ChangeDetectorRef) {
    if (grid) {
      this.grid = grid;
    }
    _intl.changes
      .pipe(unrx(this))
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    unrx.kill(this);
  }

  private updatePageSizes(): void {
    if (this.paginator && this.pageSizes.indexOf(this.paginator.perPage) === -1) {
      this.pageSizes.push(this.paginator.perPage);
    }
    this.pageSizes.sort((a, b) => a - b);
  }

  private handlePageChange(event: PblPaginatorChangeEvent): void {
    if (this.pages.length !== this.paginator.totalPages) {
      const pages = this.pages = [];
      for (let i = 1, len = this.paginator.totalPages+1; i<len; i++) { pages.push(i); }
    }
    // this is required here to prevent `ExpressionChangedAfterItHasBeenCheckedError` when the component has or wrapped
    // by an ngIf
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  static ngAcceptInputType_hidePageSize: BooleanInput;
  static ngAcceptInputType_hideRangeSelect: BooleanInput;
}
