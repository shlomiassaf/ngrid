import { Component, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

import { PblNgridComponent, PblColumn, PblNgridDataHeaderExtensionContext } from '@pebula/ngrid';
import { PblNgridOverlayPanelRef } from '@pebula/ngrid/overlay-panel';

@Component({
  selector: 'mat-excel-style-header-menu',
  templateUrl: `./excel-style-header-menu.html`,
  styleUrls: [ `./excel-style-header-menu.scss` ],
  encapsulation: ViewEncapsulation.None,
})
export class MatExcelStyleHeaderMenu {
  column: PblColumn;
  grid: PblNgridComponent

  @ViewChild('columnMenu', { read: MatMenu, static: true }) matMenu: MatMenu;
  @ViewChild('menuViewLocation', { read: ViewContainerRef, static: true }) menuViewLocation: ViewContainerRef;

  currentSort: 'asc' | 'desc' | undefined;
  currentPin: 'start' | 'end' | undefined;
  currentFilter: any = '';

  constructor(private ref: PblNgridOverlayPanelRef<PblNgridDataHeaderExtensionContext>) {
    this.column = ref.data.col;
    this.grid = ref.data.grid;

    if (this.grid.ds.sort.column === this.column) {
      this.currentSort = this.grid.ds.sort.sort.order;
    }
    this.currentPin = this.column.columnDef.sticky ? 'start' : this.column.columnDef.stickyEnd ? 'end' : undefined;
    const dsFilter = this.grid.ds.filter;
    if (dsFilter && dsFilter.type === 'value' && dsFilter.columns && dsFilter.columns.indexOf(this.column) >= 0) {
      this.currentFilter = dsFilter.filter;
    }
  }

  ngAfterViewInit() {
    this.matMenu.closed.subscribe( reason => {
      this.ref.close();
    });

    const view = this.menuViewLocation.createEmbeddedView(this.matMenu.templateRef);
    this.matMenu.setElevation(0);
    this.matMenu.focusFirstItem('program');
    this.matMenu._resetAnimation();
    view.markForCheck();
    view.detectChanges();
    this.matMenu._startAnimation();
  }

  hide(): void {
    const hidden: string[] = [this.column.id];

    for (const col of this.grid.columnApi.columns) {
      if (col.hidden) {
        hidden.push(col.id);
      }
    }

    this.grid.hideColumns = hidden;
  }

  onSortToggle(sort: 'asc' | 'desc'): void {
    if (this.currentSort === sort) {
      this.grid.ds.setSort();
    } else {
      this.grid.ds.setSort(this.column, { order: sort });
    }
  }

  onPinToggle(pin: 'start' | 'end'): void {
    if (this.currentPin === pin) {
      this.column.columnDef.updatePin()
    } else {
      this.column.columnDef.updatePin(pin)
    }
  }


  filterColumn(filterValue: string) {
    this.currentFilter = filterValue;
    if (!filterValue) {
      this.grid.setFilter();
    } else {
      this.grid.setFilter(filterValue.trim(), [ this.column ]);
    }
  }

  clickTrap(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
