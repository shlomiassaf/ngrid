import { Directive } from '@angular/core';
import { Sort, MatSort, MatSortHeader } from '@angular/material/sort';

import { SgTableComponent, KillOnDestroy, SgTableSortDefinition } from '@sac/table';

Object.defineProperty(MatSortHeader.prototype, 'column', {
  set: function(value: any) { this.id = value.id; }
});


@Directive({ selector: 'sg-table[matSort]', exportAs: 'sgMatSort' })
@KillOnDestroy()
export class SgTableMatSortDirective {

  constructor(public table: SgTableComponent<any>, public sort: MatSort) {
    table.registry.setSingle('sortContainer', MatSortHeader as any)

    this.sort.sortChange.pipe(KillOnDestroy(this)).subscribe(s => this.onSort(s));

    table.pluginEvents
      .subscribe( e => {
        if (e.kind === 'onInvalidateHeaders') {
          const table = this.table;
          if (e.rebuildColumns && table.dataSource && !table.dataSource.sort.column) {
            if (this.sort && this.sort.active) {
              this.onSort({ active: this.sort.active, direction: this.sort.direction || 'asc' });
            }
          }
        }
        if (e.kind === 'onDataSource') {
          KillOnDestroy.kill(this, e.prev);

          if (this.sort && this.sort.active) {
            this.onSort({ active: this.sort.active, direction: this.sort.direction || 'asc' });
          }

          table.dataSource.sortChange
            .pipe(KillOnDestroy(this, e.curr))
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

  private onSort(sort: Sort): void {
    const table = this.table;
    const column = table._store.table.find(c => c.id === sort.active);

    if ( !column || !column.sort ) {
      return;
    } else {
      const newSort: SgTableSortDefinition = { };
      const sortFn = typeof column.sort === 'function' && column.sort;
      if (sort.direction) {
        newSort.order = sort.direction;
      }
      if (sortFn) {
        newSort.sortFn = sortFn;
      }
      const currentSort = table.dataSource.sort;
      if (column === currentSort.column) {
        const sort = currentSort.sort || {};
        if (newSort.order === sort.order) {
          return;
        }
      }
      table.dataSource.setSort(column, newSort);
    }
  }

}
