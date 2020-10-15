import { isDevMode } from '@angular/core';
import { PblNgridComponent } from '../ngrid.component';
import { findCellDef } from '../directives/cell-def';
import { PblMetaColumn } from '../columns/meta-column';
import { isPblColumn, PblColumn } from '../columns/column';
import {
  PblNgridColumnDefinitionSet,
  PblNgridColumnSet,
  PblColumnSet,
  PblMetaRowDefinitions,
} from '../columns/types';
import { PblColumnGroup, PblColumnGroupStore } from '../columns/group-column';
import { StaticColumnWidthLogic } from '../col-width-logic/static-column-width';
import { resetColumnWidths } from '../utils/helpers';
import { PblColumnFactory } from '../columns/factory';
import { PblColumnStoreMetaRow, PblMetaColumnStore } from './types';
import { HiddenColumns } from './hidden-columns';

export class PblColumnStore {
  metaColumnIds: { header: Array<PblColumnStoreMetaRow>; footer: Array<PblColumnStoreMetaRow>; };
  metaColumns: PblMetaColumnStore[];
  columnIds: string[];
  hiddenColumnIds: string[];
  columns: PblColumn[];
  allColumns: PblColumn[];
  headerColumnDef: PblMetaRowDefinitions;
  footerColumnDef: PblMetaRowDefinitions;

  get primary(): PblColumn | undefined { return this._primary; }
  get groupStore(): PblColumnGroupStore { return this._groupStore; }

  private _primary: PblColumn | undefined;
  private _metaRows: { header: Array<PblColumnStoreMetaRow & { allKeys?: string[] }>; footer: Array<PblColumnStoreMetaRow & { allKeys?: string[] }>; };
  private byId = new Map<string, PblMetaColumnStore & { data?: PblColumn }>();
  private _groupStore: PblColumnGroupStore;
  private lastSet: PblNgridColumnSet;
  private hiddenColumns = new HiddenColumns();

  constructor(private readonly grid: PblNgridComponent) {
    this.resetIds();
    this.resetColumns();
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
      this.hiddenColumnIds = Array.from(this.hiddenColumns.hidden);
      if (didShow) {
        // TODO(shlomiassaf) [perf, 4]: Right now we attach all columns, we can improve it by attaching only those "added" (we know them from "changes")
        this.attachCustomCellTemplates();
        this.attachCustomHeaderCellTemplates();
      }
      // This is mostly required when we un-hide things (didShow === true)
      // However, when we hide, we only need it when the event comes from any are not in the view
      // i.e. areas outside of the grid or areas which are CONTENT of the grid
      this.grid.rowsApi.syncRows();
    }
  }

  addGroupBy(...columns: PblColumn[] | string[]): void {
    if (this.hiddenColumns.add(columns, 'groupBy')) {
      this.setHidden();
    }
  }

  removeGroupBy(...columns: PblColumn[] | string[]): void {
    if (this.hiddenColumns.remove(columns, 'groupBy')) {
      this.setHidden();
    }
  }

  /**
   * Move the provided `column` to the position of the `anchor` column.
   * The new location of the anchor column will be it's original location plus or minus 1, depending on the delta between
   * the columns. If the origin of the `column` is before the `anchor` then the anchor's new position is minus one, otherwise plus 1.
   */
  moveColumn(column: PblColumn, anchor: PblColumn): boolean {
    const { columns, columnIds, allColumns } = this;
    let anchorIndex = columns.indexOf(anchor);
    let columnIndex = columns.indexOf(column);
    if (anchorIndex > -1 && columnIndex > -1) {
      moveItemInArray(columnIds, columnIndex, anchorIndex);
      moveItemInArray(columns, columnIndex, anchorIndex);
      if (this.hiddenColumns.allHidden.size > 0) {
        anchorIndex = allColumns.indexOf(anchor);
        columnIndex = allColumns.indexOf(column);
      }
      moveItemInArray(allColumns, columnIndex, anchorIndex);
      return true;
    }
  }

  swapColumns(col1: PblColumn, col2: PblColumn): boolean {
    let col1Index = this.columns.indexOf(col1);
    let col2Index = this.columns.indexOf(col2);
    if (col1Index > -1 && col2Index > -1) {
      const { columns, columnIds, allColumns } = this;
      columns[col1Index] = col2;
      columns[col2Index] = col1;
      columnIds[col1Index] = col2.id;
      columnIds[col2Index] = col1.id;

      if (this.hiddenColumns.allHidden.size) {
        col1Index = allColumns.indexOf(col1);
        col2Index = allColumns.indexOf(col2);
      }
      allColumns[col1Index] = col2;
      allColumns[col2Index] = col1;
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
    for (const column of this.columns) {
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

      column.hidden = hidden.has(column.id);
      if (!column.hidden) {
        this.columns.push(column);
        this.columnIds.push(column.id);
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
      this._metaRows.header[rowDef.rowIndex] = { rowDef, keys };
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
      this._metaRows.footer.push({ rowDef, keys });
    }
    resetColumnWidths(rowWidth, this.columns, this.metaColumns);
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
      columns = this.columns;
    }

    for (const col of this.columns) {
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
      columns = [].concat(this.columns, this.metaColumns);
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

  private _updateGroup(columnSet: PblColumnSet<PblColumnGroup>): void {
    const keys: string[] = [];
    const allKeys: string[] = [];

    const groups: PblColumnGroup[] = [];

    for (let tIndex = 0; tIndex < this.columns.length; tIndex++) {
      const columns = [this.columns[tIndex - 1], this.columns[tIndex], this.columns[tIndex + 1]];
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
    this.updateMetaRow('header', columnSet.rowIndex, { rowDef: columnSet, keys, allKeys, isGroup: true })
  }


  private updateMetaRow<P extends keyof PblColumnStore['_metaRows']>(type: P, rowIndex: number, value: PblColumnStore['_metaRows'][P][0]): void {
    const curr = this._metaRows[type][rowIndex] || {};
    this._metaRows[type][rowIndex] = Object.assign(curr, value);
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
    this.columnIds = [];
    this.columns = [];
    for (const c of this.allColumns) {
      c.hidden = hidden.has(c.id);
      if (!c.hidden) {
        this.columns.push(c);
        this.columnIds.push(c.id);
      }
    }
    for (const h of this._metaRows.header) {
      if (h.isGroup) {
        h.keys = h.allKeys.filter( key => this.find(key).headerGroup.isVisible );
      }
    }
    resetColumnWidths(this.getStaticWidth(), this.columns, this.metaColumns);
  }

  private resetColumns(): void {
    this.allColumns = [];
    this.columns = [];
    this.metaColumns = [];
    this.byId.clear();
  }

  private resetIds(): void {
    this.columnIds = [];
    this.hiddenColumnIds = [];
    this._metaRows = this.metaColumnIds = { header: [], footer: [] };
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

/** Clamps a number between zero and a maximum. */
function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}
