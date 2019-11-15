import { Component, Input, ViewChild, ViewEncapsulation, AfterViewInit, Optional, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ThemePalette } from '@angular/material/core';

import { UnRx } from '@pebula/utils';
import {
  PblNgridComponent,
  PblNgridHeaderCellDefDirective,
  PblNgridCellDefDirective,
  PblNgridFooterCellDefDirective,
} from '@pebula/ngrid';

const ALWAYS_FALSE_FN = () => false;

@Component({
  selector: 'pbl-ngrid-checkbox',
  templateUrl: './table-checkbox.component.html',
  styleUrls: ['./table-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
@UnRx()
export class PblNgridCheckboxComponent implements AfterViewInit {
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

  @Input() get isCheckboxDisabled() { return this._isCheckboxDisabled; }
  set isCheckboxDisabled(value: (row: any) => boolean) {
    if (value !== this._isCheckboxDisabled) {
      this._isCheckboxDisabled = value;
      if (!this._isCheckboxDisabled || typeof this._isCheckboxDisabled !== 'function') {
        this._isCheckboxDisabled = ALWAYS_FALSE_FN;
      }
    }
  }

  @Input() get color(): ThemePalette { return this._color; }
  set color(value: ThemePalette) {
    if (value !== this._color) {
      this._color = value;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  @ViewChild(PblNgridHeaderCellDefDirective, { static: true }) headerDef: PblNgridHeaderCellDefDirective<any>;
  @ViewChild(PblNgridCellDefDirective, { static: true }) cellDef: PblNgridCellDefDirective<any>;
  @ViewChild(PblNgridFooterCellDefDirective, { static: true }) footerDef: PblNgridFooterCellDefDirective<any>;

  allSelected = false;
  length: number;

  private _selection: SelectionModel<any>;
  private _bulkSelectMode: 'all' | 'view' | 'none';
  private _isCheckboxDisabled: (row: any) => boolean = ALWAYS_FALSE_FN;
  private _color: ThemePalette;

  constructor(@Optional() public table: PblNgridComponent<any>, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {

    if (!this.selection) {
      this.selection = this.table.ds.selection;
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
      const selected = this.getCollection().filter(data => !this._isCheckboxDisabled(data));
      this.selection.select(...selected);
    }
  }

  rowItemChange(row: any): void {
    this.selection.toggle(row);
  }

  private getCollection() {
    const { ds } = this.table;
    return this.bulkSelectMode === 'view' ? ds.renderedData : ds.source;
  }

  private setupSelection(): void {
    UnRx.kill(this, this.table);
    if (this._selection) {
      this.length = this.selection.selected.length;
      this.selection.changed
        .pipe(UnRx(this, this.table))
        .subscribe( () => {
          const { length } = this.getCollection().filter(data => !this._isCheckboxDisabled(data));
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
