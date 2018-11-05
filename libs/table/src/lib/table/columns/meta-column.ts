import { TemplateRef } from '@angular/core';

import { NegTableColumnDef } from '../directives';
import { NegTableMetaCellContext } from '../context/types';
import { NegMetaColumnDefinition, NegColumnTypeDefinition } from './types';
import { parseStyleWidth, initDefinitions } from './utils';

const NEG_META_COLUMN_MARK = Symbol('NegMetaColumn');
const CLONE_PROPERTIES: Array<keyof NegMetaColumn> = ['kind', 'rowIndex'];

function isNegMetaColumn(def: NegMetaColumnDefinition): def is NegMetaColumn {
  return def instanceof NegMetaColumn || def[NEG_META_COLUMN_MARK] === true;
}

export class NegMetaColumn implements NegMetaColumnDefinition {
  //#region NegCdkVirtualScrollViewportComponentBaseColumnDefinition

   /**
   * A Unique ID for the column.
   * The ID must be unique across all columns, regardless of the type.
   * Columns with identical ID will share result in identical template.
   *
   * For example, having a header column and a footer column with the same id will result in the same cell presentation for both.
   */
  id: string;

  label?: string;

  /**
   * The type of the values in this column.
   * This is an additional level for matching columns to templates, grouping templates for a type.
   */
  type?: NegColumnTypeDefinition;

  /**
   * CSS class that get applied on the header and cell.
   * You can apply unique header/cell styles using the element name.
   */
  css?: string;

  /**
   * The width in px or % in the following format: ##% or ##px
   * Examples: '50%', '50px'
   */
  get width(): string { return this._width; }
  set width(value: string) {
    if (value !== this._width) {
      this._parsedWidth = parseStyleWidth(this._width = value);
      const isFixedWidth = this._parsedWidth && this._parsedWidth.type === 'px';
      Object.defineProperty(this, 'isFixedWidth', { value: isFixedWidth });
    }
  }
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
  data: any = {};
  //#endregion NegCdkVirtualScrollViewportComponentBaseColumnDefinition

  //#region NegMetaColumnDefinition

  kind: 'header' | 'footer';

  /**
   * The index (zero based) of the header row this column is attached to, used for multi-header setup.
   * When not set (undefined) the index is considered the LAST index.
   *
   * If you want to setup a multi header table with 2 header rows, set this to 0 for the first header row and for the 2nd header
   * row do not set a rowIndex.
   */
  rowIndex: number;
//#endregion NegMetaColumnDefinition

  get parsedWidth(): { value: number; type: 'px' | '%' } | undefined { return this._parsedWidth; }

  stickyStart: boolean;
  stickyEnd: boolean;

  /**
   * Used by neg-table to apply a custom header/footer cell template, or the default when not set.
   * @internal
   */
  template: TemplateRef<NegTableMetaCellContext<any>>;

  /**
   * When true indicates that the width is set with type pixels.
   * @internal
   */
  readonly isFixedWidth?: boolean;

  /**
   * The column def for this column.
   */
  get columnDef(): NegTableColumnDef<NegMetaColumn> { return this._columnDef; }

  private _width?: string;
  private _parsedWidth: ReturnType<typeof parseStyleWidth>;
  private _columnDef: NegTableColumnDef<NegMetaColumn>;
  private defaultWidth = '';

  constructor(def: NegMetaColumnDefinition) {
    this[NEG_META_COLUMN_MARK] = true;
    initDefinitions(def, this);

    for (const prop of CLONE_PROPERTIES) {
      if (prop in def) {
        this[prop as any] = def[prop]
      }
    }

    if (!isNegMetaColumn(def)) {
      if (typeof def.type === 'string') {
        this.type = { name: def.type } as any;
      }
    }
  }

  static extendProperty(name: keyof NegMetaColumn): void {
    if (CLONE_PROPERTIES.indexOf(name) === -1) {
      CLONE_PROPERTIES.push(name);
    }
  }

  attach(columnDef: NegTableColumnDef<NegMetaColumn>): void {
    this.detach();
    this._columnDef = columnDef;
    this.columnDef.updateWidth(this.width || this.defaultWidth);
  }

  detach(): void {
    this._columnDef = undefined;
  }

  updateWidth(fallbackDefault: string): void {
    this.defaultWidth = fallbackDefault || '';
    if (this.columnDef) {
      this.columnDef.updateWidth(this.width || fallbackDefault);
    }
  }
}
