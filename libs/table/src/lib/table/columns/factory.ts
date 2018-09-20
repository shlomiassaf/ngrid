import {
  SgBaseColumnDefinition,
  SgColumnDefinition,
  SgColumnGroupDefinition,
  SgMetaColumnDefinition,
  SgTableColumnDefinitionSet,
  SgTableColumnSet,
} from './types';
import { SgMetaColumn } from './meta-column';
import { SgColumn } from './column';
import { SgColumnGroup } from './group-column';

export type COLUMN = SgMetaColumn | SgColumn | SgColumnGroup;

export class SgColumnFactory {
  private _raw: SgTableColumnDefinitionSet = { table: [], header: [], footer: [], headerGroup: [] };
  private _defaults = {
    table: {} as Partial<SgColumnDefinition>,
    header: {} as Partial<SgMetaColumnDefinition>,
    footer: {} as Partial<SgMetaColumnDefinition>,
  };

  private _currentHeaderRow = 0;
  private _currentFooterRow = 0;

  get currentHeaderRow(): number { return this._currentHeaderRow; }
  get currentFooterRow(): number { return this._currentFooterRow; }

  build(): SgTableColumnSet {
    const { _defaults, _raw } = this;
    this._raw = this._defaults = undefined;

    const table = _raw.table.map( d => new SgColumn(Object.assign({}, _defaults.table, d)));
    const header = _raw.header.map( h => ({
      rowIndex: h.rowIndex,
      rowClassName: h.rowClassName,
      cols: h.cols.map( c => new SgMetaColumn(Object.assign({}, _defaults.header, c)) )
    }));
    const footer = _raw.footer.map( f => ({
      rowIndex: f.rowIndex,
      rowClassName: f.rowClassName,
      cols: f.cols.map( c => new SgMetaColumn(Object.assign({}, _defaults.footer, c)) )
    }));
    const headerGroup = _raw.headerGroup.map( hg => ({
      rowIndex: hg.rowIndex,
      rowClassName: hg.rowClassName,
      cols: this.buildHeaderGroups(hg.rowIndex, hg.cols, table)
    }));

    return {
      table,
      header,
      footer,
      headerGroup,
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
    this._defaults[type] = def;
    return this;
  }

  /**
   * Add table columns.
   *
   * Table columns are mandatory, they are the columns that define the structure of the data source.
   *
   * Each column will usually point to property on the row, although you can create columns that does not
   * exist on the row and handle their rendering with a cell template.
   *
   * Each table column is also a header column and a footer column that display.
   * The header and footer are automatically created, If you wish not to show them set headerRow/footerRow to false in SgTable.
   *
   */
  table(...defs: Array<SgColumnDefinition>): this {
    this._raw.table.push(...defs);
    return this;
  }

  /**
   * Add a new header row with header columns.
   * Creates an additional header row in position `currentHeaderRow` using the provided header column definitions.
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
  header(rowClassName: string, ...defs: Array<Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this;
  header(...defs: Array<Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this;
  header(...defs: Array<string | Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this {
    const rowIndex = this._currentHeaderRow++;
    const rowClassName = this.getRowClass(defs, rowIndex);
    const headers = defs.map( (d: Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition) => {
      const def: SgMetaColumnDefinition = {
        id: d.id,
        kind: 'header',
        rowIndex
      };
      return Object.assign(def, d);
    });

    this._raw.header.push({
      rowIndex,
      rowClassName,
      cols: headers,
    });
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
  footer(rowClassName: string, ...defs: Array<Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this;
  footer(...defs: Array<Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this;
  footer(...defs: Array<string | Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition>): this {
    const rowIndex = this._currentFooterRow++;
    const rowClassName = this.getRowClass(defs, rowIndex);
    const footers = defs.map( (d: Partial<SgMetaColumnDefinition> & SgBaseColumnDefinition) => {
      const def: SgMetaColumnDefinition = {
        id: d.id,
        kind: 'footer',
        rowIndex
      };
      return Object.assign(def, d);
    });

    this._raw.footer.push({
      rowIndex,
      rowClassName,
      cols: footers,
    });
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
  headerGroup(rowClassName: string, ...defs: Array<Partial<SgColumnGroupDefinition>>): this;
  headerGroup(...defs: Array<Partial<SgColumnGroupDefinition>>): this;
  headerGroup(...defs: Array<string | Partial<SgColumnGroupDefinition>>): this {
    // TODO: rowIndex in SgColumnGroupDefinition is mandatory but here we don't want it
    // but Partial is not good cause we allow not sending span and prop... need to fix.
    const rowIndex = this._currentHeaderRow++;
    const rowClassName = this.getRowClass(defs, rowIndex);
    const headerGroups: any = defs.map( d => Object.assign({ rowIndex }, d) );

    this._raw.headerGroup.push({
      rowIndex,
      rowClassName,
      cols: headerGroups,
    });

    return this;
  }

  private getRowClass(defs: any[], fallbackRowIndex: number): string {
    return typeof defs[0] === 'string' ? defs.shift() : `sg-table-row-index-${fallbackRowIndex.toString()}`;
  }

  private buildHeaderGroups(rowIndex: number, headerGroupDefs: SgColumnGroupDefinition[], table: SgColumn[]): SgColumnGroup[] {
    const headerGroup: SgColumnGroup[] = [];

    // Building of header group rows requires some work.
    // The user defined groups might not cover all columns, creating gaps between group columns so we need to add placeholder groups to cover these gaps.
    // Moreover, the user might not specify a `prop`, which we might need to complete.
    // We do that for each header group row.
    //
    // The end goal is to return a list of `SgColumnGroup` that span over the entire columns of the table.
    //
    // The logic is as follows:
    // For each column in the table, find a matching column group - a group pointing at the column by having the same `prop`
    // If found, check it's span and skip X amount of columns where X is the span.
    // If a span is not defined then treat it as a greedy group that spans over all columns ahead until the next column that has a matching group column.
    //
    // If a column does not have a matching group column, search for group columns without a `prop` specified and when found set their `prop` to the current
    // column so we will now use them as if it's a user provided group for this column...
    //
    // If no group columns exists (or left), we create an ad-hoc group column and we will now use them as if it's a user provided group for this column...
    //
    const tableDefs = table.slice();
    const defs = headerGroupDefs.slice();

    for (let i = 0, len = tableDefs.length; i < len; i++) {
      const orgProp = tableDefs[i].orgProp;
      const idx = defs.findIndex( d => d.prop === orgProp);
      const columnGroupDef: SgColumnGroupDefinition = idx > -1
        ? defs.splice(idx, 1)[0]
        : defs.find( d => !d.prop ) || { prop: orgProp, rowIndex, span: undefined }
      ;

      columnGroupDef.prop = orgProp;
      columnGroupDef.rowIndex = rowIndex;

      let take = columnGroupDef.span;
      if (! (take >= 0) ) {
        take = 0;
        for (let z = i+1; z < len; z++) {
          if (defs.findIndex( d => d.prop === tableDefs[z].orgProp) === -1) {
            take++;
          }
          else {
            break;
          }
        }
      }
      columnGroupDef.span = take;
      const group = new SgColumnGroup(columnGroupDef);
      group.columns = tableDefs.slice(i, i + take + 1);
      for (const c of group.columns) {
        c.markInGroup(group);
      }
      headerGroup.push(group);
      i += take;
    }

    return headerGroup;
  }
}

export function columnFactory(): SgColumnFactory {
  return new SgColumnFactory()
}
