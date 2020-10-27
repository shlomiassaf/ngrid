import { Subject, Observable, of } from 'rxjs';
import { isDevMode, IterableDiffer, IterableDiffers } from '@angular/core';
import { PblNgridComponent } from '../../ngrid.component';
import { findCellDef } from '../../cell/cell-def/utils';
import {
  PblColumnFactory,
  PblColumnGroup, PblColumnGroupStore,
  isPblColumn, PblColumn, PblMetaColumn,
  PblNgridColumnDefinitionSet,
  PblNgridColumnSet,
  PblColumnSet,
  PblMetaRowDefinitions,
} from '../model';
import { StaticColumnWidthLogic } from '../width-logic/static-column-width';
import { resetColumnWidths } from '../../utils/helpers';
import { PblColumnStoreMetaRow, PblMetaColumnStore, PblRowColumnsChangeEvent, PblRowTypeToColumnTypeMap } from './types';
import { HiddenColumns } from './hidden-columns';
import { GridRowType } from '../../row/types';
import { PblNgridBaseRowComponent } from '../../row/base-row.component';
import { MetaRowsStore } from './meta-rows-store';

export class PblColumnStore {
  metaColumnIds: { header: Array<PblColumnStoreMetaRow>; footer: Array<PblColumnStoreMetaRow>; };
  metaColumns: PblMetaColumnStore[];
  columnIds: string[];
  visibleColumnIds: string[];
  hiddenColumnIds: string[];
  visibleColumns: PblColumn[];
  allColumns: PblColumn[];
  headerColumnDef: PblMetaRowDefinitions;
  footerColumnDef: PblMetaRowDefinitions;

  get primary(): PblColumn | undefined { return this._primary; }
  get groupStore(): PblColumnGroupStore { return this._groupStore; }

  private _primary: PblColumn | undefined;
  private byId = new Map<string, PblMetaColumnStore & { data?: PblColumn }>();
  private _groupStore: PblColumnGroupStore;
  private lastSet: PblNgridColumnSet;
  private hiddenColumns = new HiddenColumns();
  private differ: IterableDiffer<PblColumn>;
  private _visibleChanged$ = new Subject<PblRowColumnsChangeEvent<PblColumn>>();
  private metaRowsStore: MetaRowsStore;

  constructor(private readonly grid: PblNgridComponent, private readonly differs: IterableDiffers) {
    this.metaRowsStore = new MetaRowsStore(differs);
    this.resetIds();
    this.resetColumns();
  }

  getColumnsOf<TRowType extends GridRowType>(row: PblNgridBaseRowComponent<TRowType>): PblRowTypeToColumnTypeMap<TRowType>[] {
    switch (row.rowType) {
      case 'data':
      case 'header':
      case 'footer':
        return this.visibleColumns as any;
      case 'meta-header':
      case 'meta-footer':
        return (row as any)._row.rowDef.cols;
    }
    return [];
  }

  columnRowChange(): Observable<PblRowColumnsChangeEvent<PblRowTypeToColumnTypeMap<'data'>>> {
    return this._visibleChanged$ as any;
  }

  metaRowChange() {
    return this.metaRowsStore.visibleChanged$.asObservable();
  }

  isColumnHidden(column: PblColumn) {
    return this.hiddenColumns.hidden.has(column.id);
  }

  clearColumnVisibility() {
    this.updateColumnVisibility(undefined, this.allColumns);
  }

  updateColumnVisibility(hide?: PblColumn[] | string[], show?: PblColumn[] | string[]) {
    const didHide = hide && this.hiddenColumns.add(hide);
    const didShow = show && this.hiddenColumns.remove(show);
    if (didShow || didHide) {
      this.setHidden();
      if (didShow) {
        // TODO(shlomiassaf) [perf, 4]: Right now we attach all columns, we can improve it by attaching only those "added" (we know them from "changes")
        this.attachCustomCellTemplates();
        this.attachCustomHeaderCellTemplates();
      }
      this.checkVisibleChanges();
      // This is mostly required when we un-hide things (didShow === true)
      // However, when we hide, we only need it when the event comes from any are not in the view
      // i.e. areas outside of the grid or areas which are CONTENT of the grid
      this.grid.rowsApi.syncRows();
    }
  }

  addGroupBy(...columns: PblColumn[] | string[]): void {
    if (this.hiddenColumns.add(columns, 'groupBy')) {
      this.setHidden();
      this.checkVisibleChanges();
    }
  }

  removeGroupBy(...columns: PblColumn[] | string[]): void {
    if (this.hiddenColumns.remove(columns, 'groupBy')) {
      this.setHidden();
      this.checkVisibleChanges();
    }
  }

  /**
   * Move the provided `column` to the position of the `anchor` column.
   * The new location of the anchor column will be it's original location plus or minus 1, depending on the delta between
   * the columns. If the origin of the `column` is before the `anchor` then the anchor's new position is minus one, otherwise plus 1.
   */
  moveColumn(column: PblColumn, anchor: PblColumn): boolean {
    const { visibleColumns, allColumns } = this;
    let anchorIndex = visibleColumns.indexOf(anchor);
    let columnIndex = visibleColumns.indexOf(column);
    if (anchorIndex > -1 && columnIndex > -1) {
      moveItemInArray(visibleColumns, columnIndex, anchorIndex);
      if (this.hiddenColumns.allHidden.size > 0) {
        anchorIndex = allColumns.indexOf(anchor);
        columnIndex = allColumns.indexOf(column);
      }
      moveItemInArray(allColumns, columnIndex, anchorIndex);
      this.checkVisibleChanges();
      return true;
    }
  }

  swapColumns(col1: PblColumn, col2: PblColumn): boolean {
    let col1Index = this.visibleColumns.indexOf(col1);
    let col2Index = this.visibleColumns.indexOf(col2);
    if (col1Index > -1 && col2Index > -1) {
      const { visibleColumns, allColumns } = this;
      visibleColumns[col1Index] = col2;
      visibleColumns[col2Index] = col1;

      if (this.hiddenColumns.allHidden.size) {
        col1Index = allColumns.indexOf(col1);
        col2Index = allColumns.indexOf(col2);
      }
      allColumns[col1Index] = col2;
      allColumns[col2Index] = col1;
      this.checkVisibleChanges();
      return true;
    }
    return false;
  }

  find(id: string): PblMetaColumnStore & { data?: PblColumn } | undefined {
    return this.byId.get(id);
  }

  getAllHeaderGroup(): PblColumnGroup[] {
    return this._groupStore ? this._groupStore.all : [];
  }

  getStaticWidth(): StaticColumnWidthLogic {
    const rowWidth = new StaticColumnWidthLogic();
    for (const column of this.visibleColumns) {
      rowWidth.addColumn(column);
    }
    return rowWidth;
  }

  invalidate(columnOrDefinitionSet: PblNgridColumnDefinitionSet | PblNgridColumnSet): void {
    const columnSet: PblNgridColumnSet = this.lastSet = 'groupStore' in columnOrDefinitionSet
      ? columnOrDefinitionSet
      : PblColumnFactory.fromDefinitionSet(columnOrDefinitionSet).build()
    ;
    const { groupStore, table, header, footer, headerGroup } = columnSet;

    this._groupStore = groupStore.clone();

    const rowWidth = new StaticColumnWidthLogic();
    this.resetColumns();
    this.resetIds();

    this.headerColumnDef = {
      rowClassName: (table.header && table.header.rowClassName) || '',
      type: (table.header && table.header.type) || 'fixed',
    }
    this.footerColumnDef = {
      rowClassName: (table.footer && table.footer.rowClassName) || '',
      type: (table.footer && table.footer.type) || 'fixed',
    }

    this._primary = undefined;

    this.hiddenColumnIds = Array.from(this.hiddenColumns.hidden);
    const hidden = this.hiddenColumns.syncAllHidden().allHidden;

    for (const def of table.cols) {
      let column: PblColumn;
      column = new PblColumn(def, this.groupStore);
      const columnRecord = this.getColumnRecord(column.id);
      columnRecord.data = column;
      this.allColumns.push(column);
      this.columnIds.push(column.id);

      column.hidden = hidden.has(column.id);
      if (!column.hidden) {
        this.visibleColumns.push(column);
        this.visibleColumnIds.push(column.id);
        rowWidth.addColumn(column);
      }

      if (column.pIndex) {
        if (this._primary && isDevMode()) {
          console.warn(`Multiple primary index columns defined: previous: "${this._primary.id}", current: "${column.id}"`);
        }
        this._primary = column;
      }
    }

    for (const rowDef of header) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = this.getColumnRecord(def.id, this.metaColumns);
        const column = metaCol.header || (metaCol.header = new PblMetaColumn(def));
        keys.push(column.id);
      }
      this.metaRowsStore.setHeader({ rowDef, keys, kind: 'header' });
    }

    for (const rowDef of headerGroup) {
      this._updateGroup(rowDef);
    }

    for (const rowDef of footer) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = this.getColumnRecord(def.id, this.metaColumns);
        const column = metaCol.footer || (metaCol.footer = new PblMetaColumn(def));
        keys.push(column.id);
      }
      this.metaRowsStore.setFooter({ rowDef, keys, kind: 'footer' });
    }
    resetColumnWidths(rowWidth, this.visibleColumns, this.metaColumns);
    this.differ = this.differs.find(this.visibleColumns).create((i, c) => c.id);
    this.differ.diff(this.visibleColumns);
  }

  updateGroups(...rowIndex: number[]): void {
    if (rowIndex.length === 0) {
      for (const rowDef of this.lastSet.headerGroup) {
        this._updateGroup(rowDef);
      }
    } else {
      const rows = rowIndex.slice();
      for (const rowDef of this.lastSet.headerGroup) {
        const idx = rows.indexOf(rowDef.rowIndex);
        if (idx > -1) {
          rows.splice(idx, 1);
          this._updateGroup(rowDef);
          if (rows.length === 0) {
            return;
          }
        }
      }
    }
  }

  attachCustomCellTemplates(columns?: PblColumn[]): void {
    const { registry } = this.grid;

    if (!columns) {
      columns = this.visibleColumns;
    }

    for (const col of this.visibleColumns) {
      const cell = findCellDef(registry, col, 'tableCell', true);
      if ( cell ) {
        col.cellTpl = cell.tRef;
      } else {
        const defaultCellTemplate = registry.getMultiDefault('tableCell');
        col.cellTpl = defaultCellTemplate ? defaultCellTemplate.tRef : this.grid._fbTableCell;
      }

      const editorCell = findCellDef(registry, col, 'editorCell', true);
      if ( editorCell ) {
        col.editorTpl = editorCell.tRef;
      } else {
        const defaultCellTemplate = registry.getMultiDefault('editorCell');
        col.editorTpl = defaultCellTemplate ? defaultCellTemplate.tRef : undefined;
      }
    }
  }

  attachCustomHeaderCellTemplates(columns?: Array<PblColumn | PblMetaColumnStore>): void {
    const { registry } = this.grid;

    if (!columns) {
      columns = [].concat(this.visibleColumns, this.metaColumns);
    }

    const defaultHeaderCellTemplate = registry.getMultiDefault('headerCell') || { tRef: this.grid._fbHeaderCell };
    const defaultFooterCellTemplate = registry.getMultiDefault('footerCell') || { tRef: this.grid._fbFooterCell };
    for (const col of columns) {
      if (isPblColumn(col)) {
        const headerCellDef = findCellDef(registry, col, 'headerCell', true) || defaultHeaderCellTemplate;
        const footerCellDef = findCellDef(registry, col, 'footerCell', true) || defaultFooterCellTemplate;
        col.headerCellTpl = headerCellDef.tRef;
        col.footerCellTpl = footerCellDef.tRef;
      } else {
        if (col.header) {
          const headerCellDef = findCellDef(registry, col.header, 'headerCell', true) || defaultHeaderCellTemplate;
          col.header.template = headerCellDef.tRef;
        }
        if (col.headerGroup) {
          const headerCellDef = findCellDef(registry, col.headerGroup, 'headerCell', true) || defaultHeaderCellTemplate;
          col.headerGroup.template = headerCellDef.tRef;
        }
        if (col.footer) {
          const footerCellDef = findCellDef(registry, col.footer, 'footerCell', true) || defaultFooterCellTemplate;
          col.footer.template = footerCellDef.tRef;
        }
      }
    }
  }

  dispose() {
    this._visibleChanged$.complete();
  }

  private _updateGroup(columnSet: PblColumnSet<PblColumnGroup>): void {
    const keys: string[] = [];
    const allKeys: string[] = [];

    const groups: PblColumnGroup[] = [];

    for (let tIndex = 0; tIndex < this.visibleColumns.length; tIndex++) {
      const columns = [this.visibleColumns[tIndex - 1], this.visibleColumns[tIndex], this.visibleColumns[tIndex + 1]];
      const columnGroups = columns.map( c => c ? c.getGroupOfRow(columnSet.rowIndex) : undefined );
      // true when the group exists in one of the columns BUT NOT in the LAST COLUMN (i.e: Its a slave split)
      const groupExists = groups.lastIndexOf(columnGroups[1]) !== -1;

      const column = columns[1];
      const gColumn = column.groupLogic(columnGroups as any, groupExists);
      if (gColumn !== columnGroups[1]) {
        column.markNotInGroup(columnGroups[1]);
        column.markInGroup(gColumn);
      }

      const metaCol = this.getColumnRecord(gColumn.id, this.metaColumns);
      if (!metaCol.headerGroup) {
        metaCol.headerGroup = gColumn;
      }

      if (groups.lastIndexOf(gColumn) === -1) {
        allKeys.push(gColumn.id);
        if (gColumn.isVisible) {
          keys.push(gColumn.id);
        }
      }

      gColumn.replace(column);
      groups.push(gColumn);
    }

    for (const ghost of this._groupStore.findGhosts()) {
      if (ghost.rowIndex === columnSet.rowIndex) {
        const { id } = ghost;
        let idx = allKeys.indexOf(id);
        if (idx !== -1) {
          allKeys.splice(idx, 1);
          idx = keys.indexOf(id);
          if (idx !== -1) {
            keys.splice(idx, 1);
          }
          this.metaColumns.splice(this.metaColumns.findIndex( m => m.id === id), 1);
        }
        this._groupStore.remove(ghost);
      }
    }
    this.metaRowsStore.updateHeader({ rowDef: columnSet, keys, allKeys, isGroup: true, kind: 'header' });
  }

  private getColumnRecord<T extends PblMetaColumnStore & { data?: PblColumn }>(id: string, collection?: T[]): T  {
    let columnRecord: PblMetaColumnStore & { data?: PblColumn } = this.byId.get(id);
    if (!columnRecord) {
      this.byId.set(id, columnRecord = { id });
      if (collection) {
        collection.push(columnRecord as T);
      }
    }
    return columnRecord as T;
  }

  private setHidden(): void {
    const hidden = this.hiddenColumns.syncAllHidden().allHidden;
    this.visibleColumns = [];
    for (const c of this.allColumns) {
      c.hidden = hidden.has(c.id);
      if (!c.hidden) {
        this.visibleColumns.push(c);
      }
    }
    for (const h of this.metaRowsStore.headers) {
      if (h.isGroup) {
        h.keys = h.allKeys.filter( key => this.find(key).headerGroup.isVisible );
      }
    }
    resetColumnWidths(this.getStaticWidth(), this.visibleColumns, this.metaColumns);
  }

  private resetColumns(): void {
    this.allColumns = [];
    this.visibleColumns = [];
    this.metaColumns = [];
    this.byId.clear();
  }

  private resetIds(): void {
    this.columnIds = [];
    this.visibleColumnIds = [];
    this.hiddenColumnIds = [];
    this.metaRowsStore.clear();
    this.metaColumnIds = { header: this.metaRowsStore.headers, footer: this.metaRowsStore.footers };
  }

  private checkVisibleChanges() {
    if (this.differ) {
      const changes = this.differ.diff(this.visibleColumns);
      if (changes) {
        this.hiddenColumnIds = Array.from(this.hiddenColumns.hidden);
        this.visibleColumnIds = Array.from(this.visibleColumns).map( c => c.id );
        this.columnIds = Array.from(this.allColumns).map( c => c.id );
        this._visibleChanged$.next({ columns: this.visibleColumns, changes });
      }
    }
    // no differ means we did not invalidate yet, so nothing will change until it start showing
  }
}

/**
 * Moves an item one index in an array to another.
 * @param array Array in which to move the item.
 * @param fromIndex Starting index of the item.
 * @param toIndex Index to which the item should be moved.
 */
export function moveItemInArray<T = any>(array: T[], fromIndex: number, toIndex: number): void {
  const from = clamp(fromIndex, array.length - 1);
  const to = clamp(toIndex, array.length - 1);

  if (from === to) {
    return;
  }

  const target = array[from];
  const delta = to < from ? -1 : 1;

  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }

  array[to] = target;
}

export function moveItemInArrayExt<T = any>(array: T[],
                                            fromIndex: number,
                                            toIndex: number,
                                            fn: (previousItem: T, currentItem: T, previousIndex: number, currentIndex: number) => void): void {
  const from = clamp(fromIndex, array.length - 1);
  const to = clamp(toIndex, array.length - 1);

  if (from === to) {
    return;
  }

  const target = array[from];
  const delta = to < from ? -1 : 1;

  for (let i = from; i !== to; i += delta) {
    const next = i + delta;
    fn(array[i], array[next], i, next);
    array[i] = array[next];
  }

  fn(array[to], target, to, from);
  array[to] = target;
}


/** Clamps a number between zero and a maximum. */
function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}
