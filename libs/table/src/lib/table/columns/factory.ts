import {
  PblBaseColumnDefinition,
  PblColumnDefinition,
  PblColumnGroupDefinition,
  PblMetaColumnDefinition,
  PblNgridColumnDefinitionSet,
  PblNgridColumnSet,
  PblMetaRowDefinitions
} from './types';
import { PblMetaColumn } from './meta-column';
import { PblColumn } from './column';
import { PblColumnGroup, PblColumnGroupStore } from './group-column';

export type COLUMN = PblMetaColumn | PblColumn | PblColumnGroup;

export class PblColumnFactory {
  private _raw: PblNgridColumnDefinitionSet = { table: { cols: [] }, header: [], footer: [], headerGroup: [] };
  private _defaults = {
    table: {} as Partial<PblColumnDefinition>,
    header: {} as Partial<PblMetaColumnDefinition>,
    footer: {} as Partial<PblMetaColumnDefinition>,
  };

  private _currentHeaderRow = 0;
  private _currentFooterRow = 0;

  get currentHeaderRow(): number { return this._currentHeaderRow; }
  get currentFooterRow(): number { return this._currentFooterRow; }

  static fromDefinitionSet(defs: PblNgridColumnDefinitionSet): PblColumnFactory {
    const f = new PblColumnFactory();
    Object.assign(f._raw, defs);
    return f;
  }

  build(): PblNgridColumnSet {
    const { _defaults, _raw } = this;

    const groupStore = new PblColumnGroupStore();

    const table: PblNgridColumnSet['table'] = {
      header: _raw.table.header,
      footer: _raw.table.footer,
      cols: _raw.table.cols.map( d => new PblColumn({ ..._defaults.table, ...d }, groupStore)),
    };
    const header = _raw.header.map( h => ({
      rowIndex: h.rowIndex,
      rowClassName: h.rowClassName,
      type: h.type || 'fixed',
      cols: h.cols.map( c => new PblMetaColumn( { ..._defaults.header, ...c } )),
    }));
    const footer = _raw.footer.map( f => ({
      rowIndex: f.rowIndex,
      rowClassName: f.rowClassName,
      type: f.type || 'fixed',
      cols: f.cols.map( c => new PblMetaColumn({ ..._defaults.footer, ...c }) )
    }));
    const headerGroup = _raw.headerGroup.map( hg => ({
      rowIndex: hg.rowIndex,
      rowClassName: hg.rowClassName,
      type: hg.type || 'fixed',
      cols: this.buildHeaderGroups(hg.rowIndex, hg.cols, table.cols).map( g => {
        groupStore.add(g);
        return g;
      }),
    }));

    return {
      groupStore,
      table,
      header,
      footer,
      headerGroup,
    };
  }

  /**
   * Set the default column definition for header/footer columns.
   */
  default(def: Partial<PblMetaColumnDefinition>, type: 'header' | 'footer'): this;
  /**
   * Set the default column definition for table columns.
   */
  default(def: Partial<PblColumnDefinition>, type?: 'table'): this;
  default(def: Partial<PblColumnDefinition> | Partial<PblMetaColumnDefinition>, type: 'table' | 'header' | 'footer' = 'table'): this {
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
   * The header and footer are automatically created, If you wish not to show them set headerRow/footerRow to false in PblTable.
   *
   */
  table(rowOptions: { header?: PblMetaRowDefinitions; footer?: PblMetaRowDefinitions }, ...defs: PblColumnDefinition[]): this;
  table(...defs: PblColumnDefinition[]): this;
  table(...defs: Array<{ header?: PblMetaRowDefinitions; footer?: PblMetaRowDefinitions } | PblColumnDefinition>): this {
    const rowOptions: { header?: PblMetaRowDefinitions; footer?: PblMetaRowDefinitions } = (defs[0] as any).prop ? {} : defs.shift() as any;
    const { header, footer } = rowOptions;
    Object.assign(this._raw.table, { header, footer });
    this._raw.table.cols.push(...defs as PblColumnDefinition[]);
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
   * @remarks
   * Example:
   * ```js
   *   factory.table(1, 2, 3)
   *     .header(a, b, c).header(d, e, f);
   * ```
   *
   * will result in:
   *   header1 -\>  a b c
   *   header2 -\>  d e f
   *   table   -\>  1 2 3
   */
  header(rowOptions: PblMetaRowDefinitions, ...defs: Array<Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition>): this;
  header(...defs: Array<Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition>): this;
  header(...defs: Array<PblMetaRowDefinitions | Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition>): this {
    const rowIndex = this._currentHeaderRow++;
    const rowOptions = this.processRowOptions(defs);
    const rowClassName = this.genRowClass(rowOptions, rowIndex);

    const headers = defs.map( (d: Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition) => {
      const def: PblMetaColumnDefinition = {
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
      type: (rowOptions && rowOptions.type) || 'fixed',
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
   * @remarks
   * Example:
   * ```js
   *   factory.table(1, 2, 3)
   *     .footer(a, b, c).footer(d, e, f);
   * ```
   *
   * will result in:
   *   table   -\>  1 2 3
   *   footer1 -\>  a b c
   *   footer2 -\>  d e f
   */
  footer(rowOptions: PblMetaRowDefinitions, ...defs: Array<Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition>): this;
  footer(...defs: Array<Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition>): this;
  footer(...defs: Array<PblMetaRowDefinitions | Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition>): this {
    const rowIndex = this._currentFooterRow++;
    const rowOptions = this.processRowOptions(defs);
    const rowClassName = this.genRowClass(rowOptions, rowIndex);

    const footers = defs.map( (d: Pick<PblMetaColumnDefinition, 'id'> & Partial<PblMetaColumnDefinition> & PblBaseColumnDefinition) => {
      const def: PblMetaColumnDefinition = {
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
      type: (rowOptions && rowOptions.type) || 'fixed',
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
   * @remarks
   * Example:
   * ```js
   *   factory.table(1, 2, 3)
   *     .header(a, b, c).header(d, e, f);
   * ```
   *
   * will result in:
   *   header1 -\>  a b c
   *   header2 -\>  d e f
   *   table   -\>  1 2 3
   */
  headerGroup(rowOptions: PblMetaRowDefinitions, ...defs: Array<Pick<PblColumnGroupDefinition, 'prop'> & Partial<PblColumnGroupDefinition>>): this;
  headerGroup(...defs: Array<Pick<PblColumnGroupDefinition, 'prop'> & Partial<PblColumnGroupDefinition>>): this;
  headerGroup(...defs: Array<PblMetaRowDefinitions | ( Pick<PblColumnGroupDefinition, 'prop'> & Partial<PblColumnGroupDefinition>) >): this {
    const rowIndex = this._currentHeaderRow++;
    const rowOptions = this.processRowOptions(defs, 'prop');
    const rowClassName = this.genRowClass(rowOptions, rowIndex);

    const headerGroups: any = defs.map( d => Object.assign({ rowIndex }, d) );

    this._raw.headerGroup.push({
      rowIndex,
      rowClassName,
      cols: headerGroups,
      type: (rowOptions && rowOptions.type) || 'fixed',
    });

    return this;
  }

  private processRowOptions(defs: any[], mustHaveProperty: string = 'id'): PblMetaRowDefinitions {
    return defs[0][mustHaveProperty] ? undefined : defs.shift();
  }

  private genRowClass(rowOptions: { rowClassName?: string }, fallbackRowIndex: number): string {
    return (rowOptions && rowOptions.rowClassName) || `pbl-ngrid-row-index-${fallbackRowIndex.toString()}`;
  }

  private buildHeaderGroups(rowIndex: number, headerGroupDefs: PblColumnGroupDefinition[], table: PblColumn[]): PblColumnGroup[] {
    const headerGroup: PblColumnGroup[] = [];

    // Building of header group rows requires some work.
    // The user defined groups might not cover all columns, creating gaps between group columns so we need to add placeholder groups to cover these gaps.
    // Moreover, the user might not specify a `prop`, which we might need to complete.
    // We do that for each header group row.
    //
    // The end goal is to return a list of `PblColumnGroup` that span over the entire columns of the table.
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
      const columnGroupDef: PblColumnGroupDefinition = idx !== -1
        ? defs.splice(idx, 1)[0]
        : defs.find( d => !d.prop ) || { prop: orgProp, rowIndex, span: undefined }
      ;

      const placeholder = idx === -1 && !!columnGroupDef.prop;

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
      const group = new PblColumnGroup(columnGroupDef, tableDefs.slice(i, i + take + 1), placeholder);
      headerGroup.push(group);
      i += take;
    }

    return headerGroup;
  }
}

export function columnFactory(): PblColumnFactory {
  return new PblColumnFactory()
}
