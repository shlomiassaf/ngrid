import { SgBaseColumnDefinition, SgColumnDefinition, SgColumnGroupDefinition, SgMetaColumnDefinition } from './types';
import { SgMetaColumn } from './meta-column';
import { SgColumn } from './column';
import { SgColumnGroup } from './group-column';

export type COLUMN = SgMetaColumn | SgColumn | SgColumnGroup;

export interface SgColumnFactoryResult {
  table: SgColumn[];
  header: SgMetaColumn[];
  footer: SgMetaColumn[];
  headerGroup: SgColumnGroup[];
  readonly all: COLUMN[];
}

export class SgColumnFactory {
  private _pre = {
    defaults: {
      table: {} as Partial<SgColumnDefinition>,
      header: {} as Partial<SgMetaColumnDefinition>,
      footer: {} as Partial<SgMetaColumnDefinition>,
    },
    table: [] as SgColumnDefinition[],
    header: [] as SgMetaColumnDefinition[],
    footer: [] as SgMetaColumnDefinition[],
    headerGroup: {} as { [rowIndex: number]: SgColumnGroupDefinition[] }
  };

  private _currentHeaderRow = 0;
  private _currentFooterRow = 0;

  get currentHeaderRow(): number { return this._currentHeaderRow; }
  get currentFooterRow(): number { return this._currentFooterRow; }

  build(): SgColumnFactoryResult {
    const pre = this._pre;
    this._pre = undefined;

    const table = pre.table.map( d => new SgColumn(Object.assign({}, pre.defaults.table, d)));
    const header = pre.header.map( d => new SgMetaColumn(Object.assign({}, pre.defaults.header, d)));
    const footer = pre.footer.map( d => new SgMetaColumn(Object.assign({}, pre.defaults.footer, d)));
    const headerGroup = this.buildHeaderGroups(pre.headerGroup, table);
    return {
      table,
      header,
      footer,
      headerGroup,
      get all(): any {
        return [...this.header, ...this.headerGroup, ...this.table, ...this.footer]
      }
    };

  }

  /**
   * Set the default column definition for header/footer columns.
   * @param def
   * @param type
   */
  default(def: Partial<SgMetaColumnDefinition>, type: 'header' | 'footer'): this;
  /**
   * Set the default column definition for table columns.
   */
  default(def: Partial<SgColumnDefinition>, type?: 'table'): this;
  default(def: Partial<SgColumnDefinition> | Partial<SgMetaColumnDefinition>, type: 'table' | 'header' | 'footer' = 'table'): this {
    this._pre.defaults[type] = def;
    return this;
  }

  /**
   * Add table columns.
   *
   * Table columns are mandatory, they are the columns that define the structure of the data source.
   *
   * Each column will usually point to property on the row, altough you can create columns that does not
   * exist on the row and handle their rendering with a cell template.
   *
   * Each table column is also a heder column and a footer column that display.
   * The header and footer are automatically craeted, If you wish not to show them set headerRow/footerRow to false in SgTable.
   *
   */
  table(...defs: Array<SgColumnDefinition>): this {
    this._pre.table.push(...defs);
    return this;
  }

  /**
   * Add a new header row with header columns.
   * Creats an additional header row in position `currentHeaderRow` using the provided header column definitions.
   * Each definition represent a cell, the cell's does not have to align with the layout of table columns.
   *
   * All header row will position BEFORE the table column header row.
   * Header columns are optional.
   * Each call to `header()` will create a new row, incrementing the `currentHeaderRow`.
   *
   * Example:
   * ```js
   *   factory.table(1, 2, 3)
   *     .header(a, b, c).header(d, e, f);
   * ```
   *
   * will result in:
   *   header1 ->  a b c
   *   header2 ->  d e f
   *   table   ->  1 2 3
   */
  header(...defs: Array<Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this {
    const headers = defs.map( d => {
      const def: SgMetaColumnDefinition = {
        id: d.id,
        kind: 'header',
        rowIndex: this._currentHeaderRow
      };
      return Object.assign(def, d);
    });
    this._pre.header.push(...headers);
    this._currentHeaderRow++;
    return this;
  }

  /**
   * Add a new footer row with footer columns.
   * Creates an additional footer row in position `currentFooterRow` using the provided footer column definitions.
   * Each definition represent a cell, the cell's does not have to align with the layout of table columns.
   *
   * All footer row will position AFTER the table column footer row.
   * Footer columns are optional.
   * Each call to `footer()` will create a new row, incrementing the `currentFooterRow`.
   *
   * Example:
   * ```js
   *   factory.table(1, 2, 3)
   *     .footer(a, b, c).footer(d, e, f);
   * ```
   *
   * will result in:
   *   table   ->  1 2 3
   *   footer1 ->  a b c
   *   footer2 ->  d e f
   */
  footer(...defs: Array<Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this {
    const footers = defs.map( d => {
      const def: SgMetaColumnDefinition = {
        id: d.id,
        kind: 'footer',
        rowIndex: this._currentFooterRow
      };
      return Object.assign(def, d);
    });
    this._pre.footer.push(...footers);
    this._currentFooterRow++;
    return this;
  }

  /**
   * Add a new header row with header group columns.
   * A header group column is a columns is a header columns that spans one or more columns.
   *
   * Create an additional header row in position `currentHeaderRow` using the provided header column definitions.
   * Each definition represent a cell, the cell's does not have to align with the layout of table columns.
   *
   * All header row will position BEFORE the table column header row.
   * Header columns are optional.
   * Each call to `header()` will create a new row, incrementing the `currentHeaderRow`.
   *
   * Example:
   * ```js
   *   factory.table(1, 2, 3)
   *     .header(a, b, c).header(d, e, f);
   * ```
   *
   * will result in:
   *   header1 ->  a b c
   *   header2 ->  d e f
   *   table   ->  1 2 3
   */
  headerGroup(...defs: Array<Partial<SgColumnGroupDefinition>>): this {
    // TODO: rowIndex in SgColumnGroupDefinition is mandatory but here we don't want it
    // but Partial is not good cause we allow not sending span and prop... need to fix.
    const rowIndex = this._currentHeaderRow;
    const headerGroups: any = defs.map( d => Object.assign({ rowIndex }, d) );
    this._pre.headerGroup[rowIndex] = headerGroups;

    this._currentHeaderRow += 1;
    return this;
  }

  private buildHeaderGroups(headerGroupRows: { [rowIndex: number]: SgColumnGroupDefinition[] }, table: SgColumn[]): SgColumnGroup[] {
    const headerGroup: SgColumnGroup[] = [];

    const placeholderGroupMarker = {
      data: { first: '', take: 0, columns: [] as SgColumn[] },
      buildColumnGroup(pos: number): SgColumnGroup {
        const def: SgColumnGroupDefinition =  { prop: this.data.first, span: this.data.take, rowIndex: pos };
        const internalGroup = new SgColumnGroup(def, true);
        internalGroup.columns = this.data.columns;
        for (const c of internalGroup.columns) {
          c.markInGroup(internalGroup);
        }
        this.data = { first: '', take: 0, columns: [] };
        return internalGroup;
      }
    }

    // Building of header group rows requires some work.
    // The user defined groups might not cover all headers so we need to add placeholder groups to cover these areas.
    // We do that for each header group row.
    for (const key in headerGroupRows) {
      const rowIndex = Number(key);
      const tableDefs = table.slice();
      const defs = headerGroupRows[rowIndex];

      for (let i = 0; i < tableDefs.length; i++) {
        const id = tableDefs[i].orgProp;
        const idx = defs.findIndex( d => d.prop === id );
        if (idx > -1) {
          if (placeholderGroupMarker.data.first) {
            headerGroup.push(placeholderGroupMarker.buildColumnGroup(rowIndex));
          }
          const columnGroupDef = defs[idx];
          const group = new SgColumnGroup(columnGroupDef);
          const take = columnGroupDef.span;
          group.columns = tableDefs.slice(i, i + take + 1);
          for (const c of group.columns) {
            c.markInGroup(group);
          }
          headerGroup.push(group);
          i += take;
        } else {
          if (!placeholderGroupMarker.data.first) {
            placeholderGroupMarker.data.first = tableDefs[i].orgProp;
          } else {
            placeholderGroupMarker.data.take++;
          }
          placeholderGroupMarker.data.columns.push(tableDefs[i]);
        }
      }
      if (placeholderGroupMarker.data.first) {
        headerGroup.push(placeholderGroupMarker.buildColumnGroup(rowIndex));
      }
    }
    return headerGroup;
  }
}

export function columnFactory(): SgColumnFactory {
  return new SgColumnFactory()
}
