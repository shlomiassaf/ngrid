import { filter } from 'rxjs/operators';
import { Directive, Input, IterableDiffers, IterableDiffer, IterableChangeRecord, OnDestroy } from '@angular/core';

import { PblTableComponent, PblTablePluginController, TablePlugin } from '@pebula/table';


declare module '@pebula/table/lib/ext/types' {
  interface PblTablePluginExtension {
    sticky?: PblTableStickyPluginDirective;
  }
}

export const PLUGIN_KEY: 'sticky' = 'sticky';

export function setStickyRow(table: PblTableComponent<any>, type: 'header' | 'footer', bulk: Array<['table' | number, boolean]>): void;
export function setStickyRow(table: PblTableComponent<any>, type: 'header' | 'footer', value: 'table' | number, state: boolean): void;
export function setStickyRow(table: PblTableComponent<any>, type: 'header' | 'footer', valueOrBulk: Array<['table' | number, boolean]> | 'table' | number, state?: boolean): void {
  const isHeader = type === 'header';
  const queryList = isHeader ? table._headerRowDefs : table._footerRowDefs;
  const bulk: Array<['table' | number, boolean]> = Array.isArray(valueOrBulk) ? valueOrBulk : [ [valueOrBulk, state] ];

  const addOneIfMainExists = (isHeader && table.showHeader) || (!isHeader && table.showFooter) ? 1 : 0;

  let changed: boolean;
  for (const [value, state] of bulk) {
    // the index from the user is 0 based or the table header/footer row.
    // we store them both, so we need to convert... our first is always the table header/footer and then we have the same order as the user's.
    let idx = value === 'table' ? 0 : value + addOneIfMainExists;
    if (!isHeader) {
      // sticky-styler stickRows() methods will reverse the order of footer columns
      // so we actually need to set another row to make the row we want sticky.
      // we could reverse the collection, but choosing the opposite side is better.
      // think [0, 1, 2, 3, 4] and we want 1. sticky-styler will reverse to [4, 3, 2, 1, 0] so doing nothing will stick 3.
      // the opposite is length MINUS 1 MINUS index which is 5 - 1 - 1 which is 3, in the revered array its the row 1 which is what we wanted.
      idx = (queryList.length - 1) - idx;
    }

    const rowDef = queryList.toArray()[idx];
    if (rowDef && rowDef.sticky !== state) {
      rowDef.sticky = state;
      changed = true;
    }
  }

  if (changed) {
    if (isHeader) {
      table._cdkTable.updateStickyHeaderRowStyles();
    } else {
      table._cdkTable.updateStickyFooterRowStyles();
    }
  }
}

export function setStickyColumns(table: PblTableComponent<any>, type: 'start' | 'end', bulk: Array<[string | number, boolean]>): void;
export function setStickyColumns(table: PblTableComponent<any>, type: 'start' | 'end', value: string  | number, state: boolean): void;
export function setStickyColumns(table: PblTableComponent<any>, type: 'start' | 'end', valueOrBulk: Array<[string  | number, boolean]> | string  | number, state?: boolean): void {
  const bulk: Array<[string | number, boolean]> = Array.isArray(valueOrBulk) ? valueOrBulk : [ [valueOrBulk, state] ];
  let changed: boolean;
  for (let [columnId, state] of bulk) {
    if (typeof columnId === 'string') {
      columnId = table.columnApi.visibleColumns.findIndex( c => c.orgProp === columnId );
    }
    const c = table.columnApi.visibleColumns[columnId];
    if (c) {
      changed = true;
      c.pin = state ? type : undefined;
      if (type === 'end') {
        c.columnDef.stickyEnd = state;
        c.columnDef.sticky = false;
      } else {
        c.columnDef.sticky = state;
        c.columnDef.stickyEnd = false;
      }
    }
  }
  if (changed) {
    table._cdkTable.updateStickyColumnStyles();
  }
}

@TablePlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'pbl-table[stickyColumnStart], pbl-table[stickyColumnEnd], pbl-table[stickyHeader], pbl-table[stickyFooter]' })
export class PblTableStickyPluginDirective implements OnDestroy {
  /**
   * Set the header rows you want to apply sticky positioning to.
   * Valid values are:
   *   - `table` - Literal string `table` that will set the table's main header row.
   *   - number  - The index of the row, for multi-header row. The index refers to the order you defined the header/headerGroup rows (base 0);
   *
   * For performance considerations only new values will trigger a change (i.e. the array should be treated as immutable).
   * Manipulating the array will not trigger a change (the sticky state will not change) unless sending a copy of it (replacing it, e.g. Array.slice())
   */
  @Input() set stickyColumnStart(value: Array<string | number>) {
    if (!this._startDiffer) {
      this._startDiffer = this._differs.find([]).create();
    }
    this.applyColumnDiff('start', value, this._startDiffer);
  }

  /**
   * Set the footer rows you want to apply sticky positioning to.
   * Valid values are:
   *   - `table` - Literal string `table` that will set the table's main footer row.
   *   - number  - The index of the row, for multi-footer row. The index refers to the order you defined the footer rows (base 0);
   *
   * For performance considerations only new values will trigger a change (i.e. the array should be treated as immutable).
   * Manipulating the array will not trigger a change (the sticky state will not change) unless sending a copy of it (replacing it, e.g. Array.slice())
   */
  @Input() set stickyColumnEnd(value: Array<string | number>) {
    if (!this._endDiffer) {
      this._endDiffer = this._differs.find([]).create();
    }
    this.applyColumnDiff('end', value, this._endDiffer);
  }

    /**
   * Set the header rows you want to apply sticky positioning to.
   * Valid values are:
   *   - `table` - Literal string `table` that will set the table's main header row.
   *   - number  - The index of the row, for multi-header row. The index refers to the order you defined the header/headerGroup rows (base 0);
   *
   * For performance considerations only new values will trigger a change (i.e. the array should be treated as immutable).
   * Manipulating the array will not trigger a change (the sticky state will not change) unless sending a copy of it (replacing it, e.g. Array.slice())
   */
  @Input() set stickyHeader(value: Array<'table' | number>) {
    if (!this._headerDiffer) {
      this._headerDiffer = this._differs.find([]).create();
    }
    this.applyRowDiff('header', value, this._headerDiffer);
  }

  /**
   * Set the footer rows you want to apply sticky positioning to.
   * Valid values are:
   *   - `table` - Literal string `table` that will set the table's main footer row.
   *   - number  - The index of the row, for multi-footer row. The index refers to the order you defined the footer rows (base 0);
   *
   * For performance considerations only new values will trigger a change (i.e. the array should be treated as immutable).
   * Manipulating the array will not trigger a change (the sticky state will not change) unless sending a copy of it (replacing it, e.g. Array.slice())
   */
  @Input() set stickyFooter(value: Array<'table' | number>) {
    if (!this._footerDiffer) {
      this._footerDiffer = this._differs.find([]).create();
    }
    this.applyRowDiff('footer', value, this._footerDiffer);
  }

  private _startDiffer: IterableDiffer<string | number>;
  private _endDiffer: IterableDiffer<string | number>;
  private _headerDiffer: IterableDiffer<'table' | number>;
  private _footerDiffer: IterableDiffer<'table' | number>;

  private _columnCache: { start: Array<string | number>; end: Array<string | number>; } = { start: [], end: [] };
  private _removePlugin: (table: PblTableComponent<any>) => void;

  constructor (protected readonly table: PblTableComponent<any>,
               protected readonly _differs: IterableDiffers,
               protected readonly pluginCtrl: PblTablePluginController) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    pluginCtrl.events
      .pipe(filter( e => e.kind === 'onResizeRow'))
      .subscribe( () => {
        this.table._cdkTable.updateStickyHeaderRowStyles();
        this.table._cdkTable.updateStickyColumnStyles();
        this.table._cdkTable.updateStickyFooterRowStyles();
      });

      pluginCtrl.events
        .pipe(filter ( e => e.kind === 'onInvalidateHeaders' ))
        .subscribe( () => {
          if (this._startDiffer && this.table.isInit) {
            this._startDiffer.diff([]);
            this.applyColumnDiff('start', this._columnCache.start, this._startDiffer)
          }

          if (this._endDiffer && this.table.isInit) {
            this._endDiffer.diff([]);
            this.applyColumnDiff('end', this._columnCache.end, this._endDiffer)
          }
        });
  }

  ngOnDestroy(): void {
    this._removePlugin(this.table);
  }

  protected applyColumnDiff(type: 'start' | 'end', value: Array<string | number>, differ: IterableDiffer<string | number>): void {
    if (!this.table.isInit) {
      const unsub = this.pluginCtrl.events.subscribe( event => {
        if (event.kind === 'onInit') {
          unsub.unsubscribe();
          this.applyColumnDiff(type, value, differ);
        }
      });
      return;
    }

    this._columnCache[type] = value || [];

    const changes = differ.diff(value || []);
    const bulk: Array<[string | number, boolean]> = [];
    changes.forEachOperation((record: IterableChangeRecord<string | number>, prevIndex: number, currentIndex: number) => {
      if (record.previousIndex == null) {
        bulk.push([record.item, true]);
      } else if (currentIndex == null) {
        bulk.push([record.item, false]);
      }
    });
    if (bulk.length > 0) {
      setStickyColumns(this.table, type, bulk);
    }
  }

  protected applyRowDiff(type: 'header' | 'footer', value: Array<'table' | number>, differ: IterableDiffer<'table' | number>): void {
    if (!this.table.isInit) {
      const unsub = this.pluginCtrl.events.subscribe( event => {
        if (event.kind === 'onInit') {
          unsub.unsubscribe();
          this.applyRowDiff(type, value, differ);
        }
      });
      return;
    }

    const changes = differ.diff(value || []);
    const bulk: Array<['table' | number, boolean]> = [];
    changes.forEachOperation((record: IterableChangeRecord<'table' | number>, prevIndex: number, currentIndex: number) => {
      if (record.previousIndex == null) {
        bulk.push([record.item, true]);
      } else if (currentIndex == null) {
        bulk.push([record.item, false]);
      }
    });
    if (bulk.length > 0) {
      setStickyRow(this.table, type, bulk);
    }
  }
}
