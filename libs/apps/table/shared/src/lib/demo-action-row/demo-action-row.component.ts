import { Component, EventEmitter, ViewEncapsulation, Input, ViewChild, TemplateRef, AfterViewInit, Output } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatMenuTrigger } from '@angular/material/menu';

import { NegTableComponent, AutoSizeToFitOptions } from '@pebula/table';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pbl-demo-action-row',
  templateUrl: './demo-action-row.component.html',
  styleUrls: [ './demo-action-row.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class DemoActionRowComponent implements AfterViewInit {

  @Input() get filter(): boolean { return this._filter; }
  set filter(value: boolean) { this._filter = coerceBooleanProperty(value); }

  @Input() label: string;

  @Output() refresh = new EventEmitter<void>();

  @ViewChild('actionRow', { read: TemplateRef }) actionRow: TemplateRef<any>;

  autoSizeColumnToFitOptions: AutoSizeToFitOptions = {
    columnBehavior: (column) => {
      if (column.id === 'drag_and_drop_handle' || column.id === 'selection') {
        return { keepMinWidth: true, keepMaxWidth: true };
      }
    }
  };
  autoSizeColumnToFitOptionsForever = { forceWidthType: '%', ...this.autoSizeColumnToFitOptions };

  @Input() get showFps(): boolean { return this._showFps; }
  set showFps(value: boolean) {
    this._showFps = coerceBooleanProperty(value);
  }

  private _filter = false;
  private _showFps = false;

  constructor(public table: NegTableComponent<any>) { }

  _refresh(): void {
    if (this.refresh.observers.length > 0) {
      this.refresh.emit();
    } else {
      this.table.ds.refresh();
    }
  }

  ngAfterViewInit(): void {
    this.table.createView('beforeTable', this.actionRow);
  }

  actionRowFilter(filterValue: string) {
    this.table.ds.setFilter(filterValue.trim(), this.table.columnApi.visibleColumns);
  }

  onFpsToggle(event: MouseEvent, moreMenuTrigger: MatMenuTrigger): void {
    this.showFps = !this.showFps;
    event.preventDefault();
    event.stopPropagation();
    moreMenuTrigger.closeMenu();
  }
}
