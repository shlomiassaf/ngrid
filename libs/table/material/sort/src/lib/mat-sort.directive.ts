import { Directive, OnDestroy } from '@angular/core';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';

import { UnRx } from '@pebula/utils';
import { NegTableComponent, NegTablePluginController, TablePlugin, NegTableSortDefinition } from '@pebula/table';

declare module '@pebula/table/lib/ext/types' {
  interface NegTablePluginExtension {
    matSort?: NegTableMatSortDirective;
  }
}
const PLUGIN_KEY: 'matSort' = 'matSort';

@TablePlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'neg-table[matSort]', exportAs: 'negMatSort' })
@UnRx()
export class NegTableMatSortDirective implements OnDestroy {
  private _removePlugin: (table: NegTableComponent<any>) => void;

  constructor(public table: NegTableComponent<any>, private pluginCtrl: NegTablePluginController, public sort: MatSort) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    this.sort.sortChange.pipe(UnRx(this)).subscribe(s => this.onSort(s));

    pluginCtrl.events
      .subscribe( e => {
        if (e.kind === 'onInvalidateHeaders') {
          const table = this.table;
          if (table.ds && !table.ds.sort.column) {
            if (this.sort && this.sort.active) {
              this.onSort({ active: this.sort.active, direction: this.sort.direction || 'asc' });
            }
          }
        }
        if (e.kind === 'onDataSource') {
          UnRx.kill(this, e.prev);

          if (this.sort && this.sort.active) {
            this.onSort({ active: this.sort.active, direction: this.sort.direction || 'asc' });
          }

          table.ds.sortChange
            .pipe(UnRx(this, e.curr))
            .subscribe( event => {
              if (this.sort && event.column) {
                const sort = event.sort || {};
                if (this.sort.active === event.column.id && this.sort.direction === (sort.order || '')) { return; }
                const sortable: MatSortHeader = <any> this.sort.sortables.get(event.column.id);
                if (sortable) {
                  sortable._handleClick();
                }
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this._removePlugin(this.table);
  }

  private onSort(sort: Sort): void {
    const table = this.table;
    const column = table.columnApi.visibleColumns.find(c => c.id === sort.active);

    if ( !column || !column.sort ) {
      return;
    } else {
      const newSort: NegTableSortDefinition = { };
      const sortFn = typeof column.sort === 'function' && column.sort;
      if (sort.direction) {
        newSort.order = sort.direction;
      }
      if (sortFn) {
        newSort.sortFn = sortFn;
      }
      const currentSort = table.ds.sort;
      if (column === currentSort.column) {
        const sort = currentSort.sort || {};
        if (newSort.order === sort.order) {
          return;
        }
      }
      table.ds.setSort(column, newSort);
    }
  }

}
