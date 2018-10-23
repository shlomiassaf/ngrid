import { SgTableColumnDefinitionSet, SgTableColumnSet } from './types';
import { SgMetaColumn } from './meta-column';
import { SgColumn } from './column';
import { SgColumnGroup } from './group-column';
import { StaticColumnWidthLogic } from '../col-width-logic/static-column-width';
import { updateColumnWidths } from '../utils/helpers';

export interface SgMetaColumnStore {
  id: string;
  header?: SgMetaColumn;
  footer?: SgMetaColumn;
  headerGroup?: SgColumnGroup;
  footerGroup?: SgColumnGroup;
}

export interface SgColumnStoreMetaRow {
  name: string;
  keys: string[];
  isGroup?: boolean;
}

export class SgColumnStore {
  metaRows: { header: Array<SgColumnStoreMetaRow>; footer: Array<SgColumnStoreMetaRow>; };

  tableRow: string[];

  meta: SgMetaColumnStore[];
  table: SgColumn[];
  allTable: SgColumn[];

  set hidden(value: string[]) {
    this._hidden = value
    this.setHidden();
  }

  private _metaRows: { header: Array<SgColumnStoreMetaRow & { allKeys?: string[] }>; footer: Array<SgColumnStoreMetaRow & { allKeys?: string[] }>; };
  private _hidden: string[];
  private byName = new Map<string, SgMetaColumnStore & { data?: SgColumn }>();

  constructor() {
    this.resetIds();
    this.resetColumns();
  }

  find(id: string): SgMetaColumnStore & { data?: SgColumn } | undefined {
    return this.byName.get(id);
  }

  getStaticWidth(): StaticColumnWidthLogic {
    const rowWidth = new StaticColumnWidthLogic();
    for (const column of this.table) {
      rowWidth.addColumn(column);
    }
    return rowWidth;
  }

  invalidate(columnSet: SgTableColumnDefinitionSet | SgTableColumnSet): void {
    const rowWidth = new StaticColumnWidthLogic();
    this.resetColumns();
    this.resetIds();

    const hidden = this._hidden || [];

    const getColumnRecord = (id: string, collection?: any[]) => {
      let columnRecord = this.byName.get(id);
      if (!columnRecord) {
        this.byName.set(id, columnRecord = { id });
        if (collection) {
          collection.push(columnRecord);
        }
      }
      return columnRecord;
    }

    for (const def of columnSet.table) {
      let column: SgColumn;
      column = new SgColumn(def);
      const columnRecord = getColumnRecord(column.id);
      columnRecord.data = column;
      this.allTable.push(column);

      column.hidden = hidden.indexOf(column.id) > -1;
      if (!column.hidden) {
        this.table.push(column);
        this.tableRow.push(column.id);
        rowWidth.addColumn(column);
      }
    }

    for (const rowDef of columnSet.header) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getColumnRecord(def.id, this.meta);
        const column = metaCol.header || (metaCol.header = new SgMetaColumn(def));
        keys.push(column.id);
      }
      this._metaRows.header[rowDef.rowIndex] = { name: rowDef.rowClassName, keys };
    }

    for (const rowDef of columnSet.headerGroup) {
      const keys: string[] = [];
      const allKeys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getColumnRecord(def.id, this.meta);

        const idx = this.allTable.findIndex( c => c.id === def.prop);
        const groupColumns = this.allTable.slice(idx, idx + def.span + 1);

        const column = metaCol.headerGroup || (metaCol.headerGroup = new SgColumnGroup(def, groupColumns, !!(def as SgColumnGroup).placeholder));
        allKeys.push(column.id);
        if (column.isVisible) {
          keys.push(column.id);
        }
      }
      this._metaRows.header[rowDef.rowIndex] = { name: rowDef.rowClassName, keys, allKeys, isGroup: true };
    }

    for (const rowDef of columnSet.footer) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getColumnRecord(def.id, this.meta);
        const column = metaCol.footer || (metaCol.footer = new SgMetaColumn(def));
        keys.push(column.id);
      }
      this._metaRows.footer.push({ name: rowDef.rowClassName, keys });
    }
    updateColumnWidths(rowWidth, this.table, this.meta);
  }

  private setHidden(): void {
    this.tableRow = [];
    this.table = [];
    for (const c of this.allTable) {
      c.hidden = this._hidden.indexOf(c.id) > -1;
      if (!c.hidden) {
        this.table.push(c);
        this.tableRow.push(c.id);
      }
    }
    for (const h of this._metaRows.header) {
      if (h.isGroup) {
        h.keys = h.allKeys.filter( key => this.find(key).headerGroup.isVisible );
      }
    }
    updateColumnWidths(this.getStaticWidth(), this.table, this.meta);
  }

  private resetColumns(): void {
    this.allTable = [];
    this.table = [];
    this.meta = [];
    this.byName.clear();
  }

  private resetIds(): void {
    this.tableRow = [];
    this._metaRows = this.metaRows = { header: [], footer: [] };
  }
}
