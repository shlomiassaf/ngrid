import { NegTableColumnDefinitionSet, NegTableColumnSet } from './types';
import { NegMetaColumn } from './meta-column';
import { NegColumn } from './column';
import { NegColumnSet, NegMetaRowDefinitions } from './types';
import { NegColumnGroup, NegColumnGroupStore } from './group-column';
import { StaticColumnWidthLogic } from '../col-width-logic/static-column-width';
import { resetColumnWidths } from '../utils/helpers';
import { NegColumnFactory } from './factory';

export interface NegMetaColumnStore {
  id: string;
  header?: NegMetaColumn;
  footer?: NegMetaColumn;
  headerGroup?: NegColumnGroup;
  footerGroup?: NegColumnGroup;
}

export interface NegColumnStoreMetaRow {
  rowDef: NegMetaRowDefinitions,
  keys: string[];
  isGroup?: boolean;
}

export class NegColumnStore {
  metaColumnIds: { header: Array<NegColumnStoreMetaRow>; footer: Array<NegColumnStoreMetaRow>; };
  metaColumns: NegMetaColumnStore[];
  columnIds: string[];
  columns: NegColumn[];
  allColumns: NegColumn[];
  headerColumnDef: NegMetaRowDefinitions;
  footerColumnDef: NegMetaRowDefinitions;

  set hidden(value: string[]) {
    this._hidden = value;
    this.setHidden();
  }

  get groupBy(): NegColumn[] { return this._groupBy; }

  get groupStore(): NegColumnGroupStore { return this._groupStore; }

  private _metaRows: { header: Array<NegColumnStoreMetaRow & { allKeys?: string[] }>; footer: Array<NegColumnStoreMetaRow & { allKeys?: string[] }>; };
  private _hidden: string[];
  private _allHidden: string[];
  private _groupBy: NegColumn[] = [];
  private byId = new Map<string, NegMetaColumnStore & { data?: NegColumn }>();
  private _groupStore: NegColumnGroupStore;
  private lastSet: NegTableColumnSet;

  constructor() {
    this.resetIds();
    this.resetColumns();
  }

  addGroupBy(...column: NegColumn[]): void {
    this.groupBy.push(...column);
    this.setHidden();
  }

  removeGroupBy(...column: NegColumn[]): void {
    for (const c of column) {
      const idx = this.groupBy.findIndex( gbc => gbc.id === c.id );
      if (idx > -1) {
        this.groupBy.splice(idx, 1);
      }
    }
    this.setHidden();
  }

  /**
   * Move the provided `column` to the position of the `anchor` column.
   * The new location of the anchor column will be it's original location plus or minus 1, depending on the delta between
   * the columns. If the origin of the `column` is before the `anchor` then the anchor's new position is minus one, otherwise plus 1.
   */
  moveColumn(column: NegColumn, anchor: NegColumn): boolean {
    const { columns, columnIds, allColumns } = this;
    let anchorIndex = columns.indexOf(anchor);
    let columnIndex = columns.indexOf(column);
    if (anchorIndex > -1 && columnIndex > -1) {
      moveItemInArray(columnIds, columnIndex, anchorIndex);
      moveItemInArray(columns, columnIndex, anchorIndex);
      if (this._allHidden && this._allHidden.length > 0) {
        anchorIndex = allColumns.indexOf(anchor);
        columnIndex = allColumns.indexOf(column);
      }
      moveItemInArray(allColumns, columnIndex, anchorIndex);
      return true;
    }
  }

  swapColumns(col1: NegColumn, col2: NegColumn): boolean {
    let col1Index = this.columns.indexOf(col1);
    let col2Index = this.columns.indexOf(col2);
    if (col1Index > -1 && col2Index > -1) {
      const { columns, columnIds, allColumns } = this;
      columns[col1Index] = col2;
      columns[col2Index] = col1;
      columnIds[col1Index] = col2.id;
      columnIds[col2Index] = col1.id;

      if (this._allHidden && this._allHidden.length > 0) {
        col1Index = allColumns.indexOf(col1);
        col2Index = allColumns.indexOf(col2);
      }
      allColumns[col1Index] = col2;
      allColumns[col2Index] = col1;
      return true;
    }
    return false;
  }

  find(id: string): NegMetaColumnStore & { data?: NegColumn } | undefined {
    return this.byId.get(id);
  }

  getAllHeaderGroup(): NegColumnGroup[] {
    return this._groupStore ? this._groupStore.all : [];
  }

  getStaticWidth(): StaticColumnWidthLogic {
    const rowWidth = new StaticColumnWidthLogic();
    for (const column of this.columns) {
      rowWidth.addColumn(column);
    }
    return rowWidth;
  }

  invalidate(columnOrDefinitionSet: NegTableColumnDefinitionSet | NegTableColumnSet): void {
    const columnSet: NegTableColumnSet = this.lastSet = 'groupStore' in columnOrDefinitionSet
      ? columnOrDefinitionSet
      : NegColumnFactory.fromDefinitionSet(columnOrDefinitionSet).build()
    ;
    const { groupStore, table, header, footer, headerGroup } = columnSet;

    this._groupStore = groupStore.clone();

    const rowWidth = new StaticColumnWidthLogic();
    this.resetColumns();
    this.resetIds();
    const hidden = this._allHidden = (this._hidden || []).concat(this._groupBy.map( c => c.id ));

    this.headerColumnDef = {
      rowClassName: (table.header && table.header.rowClassName) || '',
      type: (table.header && table.header.type) || 'fixed',
    }
    this.footerColumnDef = {
      rowClassName: (table.footer && table.footer.rowClassName) || '',
      type: (table.footer && table.footer.type) || 'fixed',
    }

    for (const def of table.cols) {
      let column: NegColumn;
      column = new NegColumn(def, this.groupStore);
      const columnRecord = this.getColumnRecord(column.id);
      columnRecord.data = column;
      this.allColumns.push(column);

      column.hidden = hidden.indexOf(column.id) > -1;
      if (!column.hidden) {
        this.columns.push(column);
        this.columnIds.push(column.id);
        rowWidth.addColumn(column);
      }
    }

    for (const rowDef of header) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = this.getColumnRecord(def.id, this.metaColumns);
        const column = metaCol.header || (metaCol.header = new NegMetaColumn(def));
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
        const column = metaCol.footer || (metaCol.footer = new NegMetaColumn(def));
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

  private _updateGroup(columnSet: NegColumnSet<NegColumnGroup>): void {
    const keys: string[] = [];
    const allKeys: string[] = [];

    const groups: NegColumnGroup[] = [];

    for (let tIndex = 0; tIndex < this.columns.length; tIndex++) {
      const columns = [this.columns[tIndex - 1], this.columns[tIndex], this.columns[tIndex + 1]];
      const columnGroups = columns.map( c => c ? c.getGroupOfRow(columnSet.rowIndex) : undefined );
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


  private updateMetaRow<P extends keyof NegColumnStore['_metaRows']>(type: P, rowIndex: number, value: NegColumnStore['_metaRows'][P][0]): void {
    const curr = this._metaRows[type][rowIndex] || {};
    this._metaRows[type][rowIndex] = Object.assign(curr, value);
  }

  private getColumnRecord<T extends NegMetaColumnStore & { data?: NegColumn }>(id: string, collection?: T[]): T  {
    let columnRecord: NegMetaColumnStore & { data?: NegColumn } = this.byId.get(id);
    if (!columnRecord) {
      this.byId.set(id, columnRecord = { id });
      if (collection) {
        collection.push(columnRecord as T);
      }
    }
    return columnRecord as T;
  }

  private setHidden(): void {
    this._allHidden = (this._hidden || []).concat(this._groupBy.map( c => c.id ));
    this.columnIds = [];
    this.columns = [];
    for (const c of this.allColumns) {
      c.hidden = this._allHidden.indexOf(c.id) > -1;
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
