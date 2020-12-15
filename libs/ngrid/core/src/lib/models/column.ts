import { DataSourceColumnPredicate, PblNgridSorter } from '../data-source/types';

export type META_COLUMN_TYPES = 'header' | 'headerGroup' | 'footer';
export type COLUMN_TYPES = META_COLUMN_TYPES | 'table';

export interface PblColumnTypeDefinitionDataMap {
  [typeName: string]: any;
}

export type PblColumnTypeDefinition<P extends keyof PblColumnTypeDefinitionDataMap = any> = { name: P; data?: PblColumnTypeDefinitionDataMap[P] };

  /**
   * The type of the values in this column.
   * This is an additional level for matching columns to templates, grouping templates for a type.
   */
  // type: string | ;
  /**
   * Optional value to be used by the template when rendering the cell.
   * Any value is allowed, including functions which allow complex scenarios, for example rendering a cell based on values from other cells.
   */
  // typeData?: any;

export interface PblBaseColumnDefinition {
  /**
   * A Unique ID for the column.
   * The ID must be unique across all columns, regardless of the type.
   * Columns with identical ID will share result in identical template.
   *
   * For example, having a header column and a footer column with the same id will result in the same cell presentation for both.
   *
   * > The ID is mandatory. Some implementation might use other values to auto-generate it and some might require it explicitly.
   * This is what it is optional.
   */
  id?: string;
  label?: string;

  /**
   * The type of the values in this column.
   * This is an additional level for matching columns to templates, grouping templates for a type.
   */
  type?: string | PblColumnTypeDefinition;

  /**
   * CSS class that get applied on the header and cell.
   * You can apply unique header/cell styles using the element name.
   */
  css?: string;

  /**
   * The width in px or % in the following format: ##% or ##px
   * Examples: '50%', '50px'
   */
  width?: string;
  /**
   * This minimum width in pixels
   * This is an absolute value, thus a number.
   */
  minWidth?: number;
  /**
   * This maximum width in pixels
   * This is an absolute value, thus a number.
   */
  maxWidth?: number;

  /**
   * A place to store things...
   * This must be an object, values are shadow-copied so persist data between multiple plugins.
   */
  data?: any;
}

export interface PblMetaColumnDefinition extends PblBaseColumnDefinition {
  /**
   * A Unique ID for the column.
   */
  id: string;

  kind: 'header' | 'footer';

  /**
   * The index (zero based) of the header row this column is attached to, used for multi-header setup.
   * When not set (undefined) the index is considered the LAST index.
   */
  rowIndex: number;
}

export interface PblColumnGroupDefinition extends PblBaseColumnDefinition {
  /**
   * A Unique ID for the column.
   * Auto-generated from the property
   */
  id?: string;

  kind: 'header' | 'footer';

   /**
   * The index (zero based) of the header row this header group column is attached to, used for multi-header setup.
   */
  rowIndex: number;

  /**
   * The grid's column that is the first child column for this group.
   * @deprecated Removed in 4.0.0, use columnIds instead
   */
  prop?: string;

  /**
   * The total span of the group (excluding the first child - i.e. prop).
   * The span and prop are used to get the child columns of this group.
   * The span is not dynamic, once the columns are set they don't change.
   *
   * For example, if a we have a span of 2 and the column at the 2nd position is hidden it will still count as
   * being spanned although the UI will span only 1 column... (because the 2nd is hidden...)
   *
   * @deprecated Removed in 4.0.0, use columnIds instead
   */
  span?: number;

  columnIds?: string[];
}

export interface PblColumnDefinition extends PblBaseColumnDefinition {
  /**
   * A Unique ID for the column.
   * Whe not set (recommend) it is auto-generated by concatenating the values of `prop` and ,
   * If you set this value manually, make sure it does not conflict with other columns!
   */
  id?: string;

  /**
   * When set, defines this column as the primary index of the data-set with all values in this column being unique.
   */
  pIndex?: boolean;

  /**
   * The property to display (from the row element)
   * You can use dot notation to display deep paths.
   */
  prop: string;

  headerType?: string | PblColumnTypeDefinition;
  footerType?: string | PblColumnTypeDefinition;

  /**
   * A path to a nested object, relative to the row element.
   * The grid will display `prop` from the object referenced by `path`.
   *
   * You can also use dot notation directly from `prop`.
   *
   * Example:
   * prop: "street"
   * path: [ "myInstance", "user", "address"
   *
   * is identical to:
   * prop: "myInstance.user.address.street"
   *
   */
  path?: string[];

  sort?: boolean | PblNgridSorter;

  /**
   * A custom predicate function to filter rows using the current column.
   *
   * Valid only when filtering by value.
   * See `PblDataSource.setFilter` for more information.
   */
  filter?: DataSourceColumnPredicate;

  /**
   * Indicates if the grid is editable or not.
   * Note that an editable also requires an edit template to qualify as editable, this flag alone is not enough.
   */
  editable?: boolean;

  pin?: 'start' | 'end';

  /**
   * An alias used to identify the column.
   * Useful when the server provides sort/filter metadata that does not have a 1:1 match with the column names.
   * e.g. Deep path props, property name convention mismatch, etc...
   */
  alias?: string;

  /**
   * Optional transformer that control the value output from the combination of a column and a row.
   * The value returned from this transformer will be returned from `PblColumn.getValue`
   */
  transform?: (value: any, row?: any, col?: PblColumnDefinition) => any;
}

export interface PblMetaRowDefinitions {
  rowClassName?: string;
  type?: 'row' | 'sticky' | 'fixed';
}
/**
 * Represent a list of meta column's that together form a META ROW.
 * In other words, this is the definition of a row, using it's building blocks - the columns.
 *
 * > A row in the grid represents a row in the datasource, A **meta row** does not, it can represent anything.
 * Meta rows are header, footer and header group.
 */
export interface PblColumnSet<T extends PblMetaColumnDefinition | PblColumnGroupDefinition> extends PblMetaRowDefinitions {
  rowIndex: number;
  cols: T[];
}

/**
 * Represent a complete column definition set for a grid. (table, header, footer and headerGroup columns).
 *
 * `PblNgridColumnDefinitionSet` contains POJO objects (simple JSON like objects) for each column type (`PblColumnDefinition`, `PblMetaColumnDefinition` and `PblColumnGroupDefinition`)
 * which are later used to create runtime instance for each column type (`PblColumn`, `PblMetaColumn` and `PblColumnGroup`)
 *
 * Because `PblNgridColumnDefinitionSet` contains POJO objects it can be serialized easily.
 */
export interface PblNgridColumnDefinitionSet {
  table: {
    header?: PblMetaRowDefinitions;
    footer?: PblMetaRowDefinitions;
    cols: PblColumnDefinition[];
  };
  header: PblColumnSet<PblMetaColumnDefinition>[];
  footer: PblColumnSet<PblMetaColumnDefinition>[];
  headerGroup: PblColumnSet<PblColumnGroupDefinition>[];
}
