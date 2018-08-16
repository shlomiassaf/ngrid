import { COLUMN_DEF, SgMetaColumn, SgColumn, SgColumnGroup, SgMetaColumnDefinition } from './columns';
import { META_COLUMN_TYPES } from './columns/types';
import { isColumnDefinition, isColumnGroupDefinition } from './columns/utils';
import { RowWidthStaticAggregator } from './row-width-static-aggregator';

export interface SgMetaColumnStore {
  id: string;
  header?: SgMetaColumn;
  footer?: SgMetaColumn;
  headerGroup?: SgColumnGroup;
}

export class SgColumnStore {
  headerIds: { type: 'header' | 'headerGroup'; keys: string[] }[];
  tableIds: string[];
  footerIds: string[][]

  table: SgColumn[];
  meta: SgMetaColumnStore[];

  constructor() {
    this.resetIds();
    this.resetColumns();
  }

  invalidate(columns: Array<COLUMN_DEF>, rowWidth: RowWidthStaticAggregator, rebuildColumns = false): void {
    if (rebuildColumns) {
      this.resetColumns();
    }
    this.resetIds();

    const meta = new Map<string, SgMetaColumnStore>();
    for ( const m of this.meta) {
      const { id } = m;
      meta.set(id, m);
    }

    const groups: SgColumnGroup[] = [];
    for (const def of columns) {
      if (isColumnDefinition(def)) {
        let column: SgColumn;
        if (rebuildColumns) {
          column = new SgColumn(def);
          this.table.push(column);
        } else {
          column = this.table.find( c => c.prop === def.prop );
        }
        this.tableIds.push(column.id);
        rowWidth.aggColumn(column);
      } else {
        let metaCol = meta.get(def.id);
        if (!metaCol) {
          meta.set(def.id, metaCol = { id: def.id });
          this.meta.push(metaCol);
        }

        const metaType: META_COLUMN_TYPES = isColumnGroupDefinition(def) ? 'headerGroup' : def.kind;
        let column = metaCol[metaType];
        if (!column) {
          column = metaCol[metaType] = isColumnGroupDefinition(def)
            ? new SgColumnGroup(def, !!(def as SgColumnGroup).placeholder)
            : new SgMetaColumn(def)
          ;
        }

        if (metaType === 'footer') {
          const coll = this.footerIds[column.rowIndex] || (this.footerIds[column.rowIndex] = []);
          coll.push(column.id);
        } else {
          const metaIds = this.headerIds;
          const coll = metaIds[column.rowIndex] || (metaIds[column.rowIndex] = { type: metaType, keys: [] });
          coll.keys.push(column.id);
          if (column instanceof SgColumnGroup) {
            groups.push(column);
          }
        }
      }
    }
  }

  private resetColumns(): void {
    this.table = [];
    this.meta = [];
  }

  private resetIds(): void {
    this.footerIds = [];
    this.headerIds = [];
    this.tableIds = [];
  }
}
