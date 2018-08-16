import { Component, Input, ViewChild, ViewEncapsulation, AfterViewInit, Optional } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import {
  SgTableComponent,
  SgTableRegistryService,
  SgTableHeaderCellDefDirective,
  SgTableCellDefDirective,
  SgTableFooterCellDefDirective,
  KillOnDestroy
} from '@sac/table';

@Component({
  selector: 'sg-table-checkbox',
  templateUrl: './table-checkbox.component.html',
  styleUrls: ['./table-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@KillOnDestroy()
export class SgTableCheckboxComponent implements AfterViewInit {
  /**
   * Unique name for the checkbox column.
   * When not set, the name 'checkbox' is used.
   *
   **/
  @Input() name: string;

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

  @ViewChild(SgTableHeaderCellDefDirective) headerDef: SgTableHeaderCellDefDirective<any>;
  @ViewChild(SgTableCellDefDirective) cellDef: SgTableCellDefDirective<any>;
  @ViewChild(SgTableFooterCellDefDirective) footerDef: SgTableFooterCellDefDirective<any>;

  length: number | '' = '';

  private _selection: SelectionModel<any>;

  constructor(@Optional() public table: SgTableComponent<any>) {}

  ngAfterViewInit(): void {

    if (!this.selection) {
      this.selection = this.table.dataSource.selection;
    }

    const registry = this.table.registry;
    registry.addMulti('headerCell', this.headerDef);
    registry.addMulti('tableCell', this.cellDef);
    registry.addMulti('footerCell', this.footerDef);
  }

  isAllSelected(): boolean {
    return !this.selection.isEmpty() && this.selection.selected.length === this.table.dataSource.renderedData.length;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.table.dataSource.renderedData.forEach(data => this.selection.select(data));
    }
  }

  rowItemChange(row: any): void {
    this.selection.toggle(row);
  }

  private setupSelection(): void {
    KillOnDestroy.kill(this, this.table);
    if (this._selection) {
      this.length = this.selection.selected.length || '';
      this.selection.onChange
        .pipe(KillOnDestroy(this, this.table))
        .subscribe( () => (this.length = this.selection.selected.length || '') );
    } else {
      this.length = '';
    }
  }
}
