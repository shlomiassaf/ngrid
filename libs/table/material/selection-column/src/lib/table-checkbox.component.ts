import { Component, Input, ViewChild, ViewEncapsulation, AfterViewInit, Optional, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import {
  NegTableComponent,
  NegTableHeaderCellDefDirective,
  NegTableCellDefDirective,
  NegTableFooterCellDefDirective,
  KillOnDestroy
} from '@neg/table';

@Component({
  selector: 'neg-table-checkbox',
  templateUrl: './table-checkbox.component.html',
  styleUrls: ['./table-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
@KillOnDestroy()
export class NegTableCheckboxComponent implements AfterViewInit {
  /**
   * Unique name for the checkbox column.
   * When not set, the name 'checkbox' is used.
   *
   **/
  @Input() name: string;

  /**
   * Defines the behavior when clicking on the bulk select checkbox (header).
   * There are 2 options:
   *
   * - all: Will select all items in the current collection
   * - view: Will select only the rendered items in the view
   *
   * The default value is `all`
   */
  @Input() get bulkSelectMode(): 'all' | 'view' | 'none' { return this._bulkSelectMode; }
  set bulkSelectMode(value: 'all' | 'view' | 'none') {
    if (value !== this._bulkSelectMode) {
      this._bulkSelectMode = value;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }
  /**
   * A Custom selection model, optional.
   * If not set, the selection model from the DataSource is used.
   */
  @Input()
  get selection(): SelectionModel<any> {
    return this._selection;
  }
  set selection(value: SelectionModel<any>) {
    if (value !== this._selection) {
      this._selection = value;
      this.setupSelection();
    }
  }

  @ViewChild(NegTableHeaderCellDefDirective) headerDef: NegTableHeaderCellDefDirective<any>;
  @ViewChild(NegTableCellDefDirective) cellDef: NegTableCellDefDirective<any>;
  @ViewChild(NegTableFooterCellDefDirective) footerDef: NegTableFooterCellDefDirective<any>;

  allSelected = false;
  length: number;

  private _selection: SelectionModel<any>;
  private _bulkSelectMode: 'all' | 'view' | 'none';

  constructor(@Optional() public table: NegTableComponent<any>, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {

    if (!this.selection) {
      this.selection = this.table.dataSource.selection;
    }

    const registry = this.table.registry;
    registry.addMulti('headerCell', this.headerDef);
    registry.addMulti('tableCell', this.cellDef);
    registry.addMulti('footerCell', this.footerDef);
  }

  masterToggle(): void {
    if (this.allSelected) {
      this.selection.clear();
    } else {
      this.selection.select(...this.getCollection());
    }
  }

  rowItemChange(row: any): void {
    this.selection.toggle(row);
  }

  private getCollection() {
    const { dataSource } = this.table;
    return this.bulkSelectMode === 'view' ? dataSource.renderedData : dataSource.source;
  }

  private setupSelection(): void {
    KillOnDestroy.kill(this, this.table);
    if (this._selection) {
      this.length = this.selection.selected.length;
      this.selection.changed
        .pipe(KillOnDestroy(this, this.table))
        .subscribe( () => {
          const { length } = this.getCollection();
          this.allSelected = !this.selection.isEmpty() && this.selection.selected.length === length;
          this.length = this.selection.selected.length;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
    } else {
      this.length = 0;
    }
  }
}
