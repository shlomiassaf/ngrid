import { Component, ViewEncapsulation, Input, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { PblNgridComponent } from '@pebula/table';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-table-action-row',
  templateUrl: './table-action-row.component.html',
  styleUrls: [ './table-action-row.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class TableActionRowComponent implements AfterViewInit {

  @Input() get filter(): boolean { return this._filter; }
  set filter(value: boolean) { this._filter = coerceBooleanProperty(value); }

  @Input() label: string;

  @ViewChild('actionRow', { read: TemplateRef }) actionRow: TemplateRef<any>;

  private _filter = false;

  constructor(public table: PblNgridComponent<any>) { }

  refresh(): void {
    this.table.ds.refresh();
  }

  ngAfterViewInit(): void {
    this.table.createView('beforeTable', this.actionRow);
  }

  actionRowFilter(filterValue: string) {
    this.table.ds.setFilter(filterValue.trim(), this.table.columnApi.visibleColumns);
  }
}
