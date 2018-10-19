import { SgTableColumnDefinitionSet, SgTableColumnSet } from './types';
import { SgMetaColumn } from './meta-column';
import { SgColumn } from './column';
import { SgColumnGroup } from './group-column';
import { RowWidthStaticAggregator } from '../row-width-static-aggregator';
import { updateColumnWidths } from '../utils/helpers';

export interface SgMetaColumnStore {
  id: string;
  header?: SgMetaColumn;
  footer?: SgMetaColumn;
  headerGroup?: SgColumnGroup;
  footerGroup?: SgColumnGroup;
}

export class SgColumnStore {
  metaRows: {
    header: Array<{ name: string; keys: string[], isGroup?: boolean }>;
    footer: Array<{ name: string; keys: string[], isGroup?: boolean }>;
  }
  tableRow: string[];

  meta: SgMetaColumnStore[];
  table: SgColumn[];
  allTable: SgColumn[];

  private byName = new Map<string, SgMetaColumnStore & { data?: SgColumn }>();


  constructor() {
    this.resetIds();
    this.resetColumns();
  }

  setExcluded(...columnIds: string[]): void {
    this.tableRow = [];
    this.table = [];
    for (const c of this.allTable) {
      if (columnIds.indexOf(c.id) === -1) {
        this.table.push(c);
        this.tableRow.push(c.id);
      }
    }
    updateColumnWidths(this.reCalcRowWidth(), this.table, this.meta);
  }

  find(id: string): SgMetaColumnStore & { data?: SgColumn } | undefined {
    return this.byName.get(id);
  }

  reCalcRowWidth(): RowWidthStaticAggregator {
    const rowWidth = new RowWidthStaticAggregator();
    for (const column of this.table) {
      rowWidth.aggColumn(column);
    }
    return rowWidth;
  }

  invalidate(columnSet: SgTableColumnDefinitionSet | SgTableColumnSet): void {
    const rowWidth = new RowWidthStaticAggregator();
    this.resetColumns();
    this.resetIds();

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
      this.table.push(column);
      this.tableRow.push(column.id);
      rowWidth.aggColumn(column);
    }

    for (const rowDef of columnSet.header) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getColumnRecord(def.id, this.meta);
        const column = metaCol.header || (metaCol.header = new SgMetaColumn(def));
        keys.push(column.id);
      }
      this.metaRows.header[rowDef.rowIndex] = { name: rowDef.rowClassName, keys };
    }

    for (const rowDef of columnSet.headerGroup) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getColumnRecord(def.id, this.meta);
        const column = metaCol.headerGroup || (metaCol.headerGroup = new SgColumnGroup(def, !!(def as SgColumnGroup).placeholder));
        keys.push(column.id);
      }
      this.metaRows.header[rowDef.rowIndex] = { name: rowDef.rowClassName, keys, isGroup: true };
    }

    for (const rowDef of columnSet.footer) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getColumnRecord(def.id, this.meta);
        const column = metaCol.footer || (metaCol.footer = new SgMetaColumn(def));
        keys.push(column.id);
      }
      this.metaRows.footer.push({ name: rowDef.rowClassName, keys });
    }
    updateColumnWidths(rowWidth, this.table, this.meta);
  }

  private resetColumns(): void {
    this.allTable = [];
    this.table = [];
    this.meta = [];
    this.byName.clear();
  }

  private resetIds(): void {
    this.tableRow = [];
    this.metaRows = { header: [], footer: [] };
  }
}
