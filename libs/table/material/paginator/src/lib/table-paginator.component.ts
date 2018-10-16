import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { SgPagingPaginator, SgPaginatorChangeEvent, SgTableComponent, KillOnDestroy } from '@sac/table';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

@Component({
  selector: 'sg-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
  host: {
    'class': 'mat-paginator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
@KillOnDestroy()
export class SgPaginatorComponent implements OnDestroy {
  pages: number[] = [];
  pageSizes: number[] = DEFAULT_PAGE_SIZE_OPTIONS.slice();

  @Input() get pageSizeOptions(): number[] { return this._pageSizeOptions; }
  set pageSizeOptions(value: number[]) {
    this._pageSizeOptions = value;
    this.pageSizes = (value || DEFAULT_PAGE_SIZE_OPTIONS).slice();
    this.updatePageSizes();
  }

  @Input() get paginator(): SgPagingPaginator { return this._paginator; }
  set paginator(value: SgPagingPaginator) {
    if (this._paginator === value) {
      return;
    }
    if (this._paginator) {
      KillOnDestroy.kill(this, this._paginator);
    }
    this._paginator = value;
    if (value) {
      // pagination.onChange is BehaviorSubject so handlePageChange will trigger
      value.onChange
        .pipe(KillOnDestroy(this, value))
        .subscribe( event => this.handlePageChange(event) );
      this.updatePageSizes();
    }
  }

  @Input() table: SgTableComponent<any>;

  private _pageSizeOptions: number[];
  private _paginator: SgPagingPaginator;

  constructor(@Optional() table: SgTableComponent<any>,
              public _intl: MatPaginatorIntl,
              private cdr: ChangeDetectorRef) {
    if (table) {
      this.table = table;
    }
    _intl.changes
      .pipe(KillOnDestroy(this))
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {

  }

  private updatePageSizes(): void {
    if (this.paginator && this.pageSizes.indexOf(this.paginator.perPage) === -1) {
      this.pageSizes.push(this.paginator.perPage);
    }
    this.pageSizes.sort((a, b) => a - b);
  }

  private handlePageChange(event: SgPaginatorChangeEvent): void {
    if (this.pages.length !== this.paginator.totalPages) {
      const pages = this.pages = [];
      for (let i = 1, len = this.paginator.totalPages+1; i<len; i++) { pages.push(i); }
    }
    // this is required here to prevent `ExpressionChangedAfterItHasBeenCheckedError` when the component has or wrapped
    // by an ngIf
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
}
