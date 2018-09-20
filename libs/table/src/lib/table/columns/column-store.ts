import { SgTableColumnDefinitionSet, SgTableColumnSet } from './types';
import { SgMetaColumn } from './meta-column';
import { SgColumn } from './column';
import { SgColumnGroup } from './group-column';
import { RowWidthStaticAggregator } from '../row-width-static-aggregator';

export interface SgMetaColumnStore {
  id: string;
  header?: SgMetaColumn;
  footer?: SgMetaColumn;
  headerGroup?: SgColumnGroup;
}

export class SgColumnStore {
  metaRows: {
    header: Array<{ name: string; keys: string[], isGroup?: boolean }>;
    footer: Array<{ name: string; keys: string[] }>;
  }
  tableRow: string[];

  meta: SgMetaColumnStore[];
  table: SgColumn[];

  constructor() {
    this.resetIds();
    this.resetColumns();
  }

  invalidate(columnSet: SgTableColumnDefinitionSet | SgTableColumnSet, rowWidth: RowWidthStaticAggregator, rebuildColumns = false): void {
    const meta = new Map<string, SgMetaColumnStore>();
    if (rebuildColumns) {
      this.resetColumns();
    } else {
      for (const m of this.meta) {
        meta.set(m.id, m);
      }
    }
    this.resetIds();

    for (const def of columnSet.table) {
      let column: SgColumn;
      if (rebuildColumns) {
        column = new SgColumn(def);
        this.table.push(column);
      } else {
        column = this.table.find( c => c.prop === def.prop );
      }
      this.tableRow.push(column.id);
      rowWidth.aggColumn(column);
    }

    const getMetaCol = (id: string) => {
      let metaCol = meta.get(id);
      if (!metaCol) {
        meta.set(id, metaCol = { id });
        this.meta.push(metaCol);
      }
      return metaCol;
    }

    for (const rowDef of columnSet.header) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getMetaCol(def.id);
        const column = metaCol.header || (metaCol.header = new SgMetaColumn(def));
        keys.push(column.id);
      }
      this.metaRows.header[rowDef.rowIndex] = { name: rowDef.rowClassName, keys };
    }

    for (const rowDef of columnSet.headerGroup) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getMetaCol(def.id);
        const column = metaCol.headerGroup || (metaCol.headerGroup = new SgColumnGroup(def, !!(def as SgColumnGroup).placeholder));
        keys.push(column.id);
      }
      this.metaRows.header[rowDef.rowIndex] = { name: rowDef.rowClassName, keys };
    }

    for (const rowDef of columnSet.footer) {
      const keys: string[] = [];
      for (const def of rowDef.cols) {
        const metaCol = getMetaCol(def.id);
        const column = metaCol.footer || (metaCol.footer = new SgMetaColumn(def));
        keys.push(column.id);
      }
      this.metaRows.footer.push({ name: rowDef.rowClassName, keys });
    }
  }

  private resetColumns(): void {
    this.table = [];
    this.meta = [];
  }

  private resetIds(): void {
    this.tableRow = [];
    this.metaRows = { header: [], footer: [] };
  }
}
