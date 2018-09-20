import { TemplateRef } from '@angular/core';

import { SgTableColumnDef } from '../directives';
import { SgMetaColumnDefinition, SgTableMetaCellTemplateContext, SgColumnTypeDefinition } from './types';
import { parseStyleWidth, initDefinitions } from './utils';

export class SgMetaColumn implements SgMetaColumnDefinition {
  //#region SgBaseColumnDefinition

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
  type?: SgColumnTypeDefinition;

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
  minWidth?: number;

  /**
   * A place to store things...
   * This must be an object, values are shadow-copied so persist data between multiple plugins.
   */
  data: any = {};
  //#endregion SgBaseColumnDefinition

  //#region SgMetaColumnDefinition

  kind: 'header' | 'footer';

  /**
   * The index (zero based) of the header row this column is attached to, used for multi-header setup.
   * When not set (undefined) the index is considered the LAST index.
   *
   * If you want to setup a multi header table with 2 header rows, set this to 0 for the first header row and for the 2nd header
   * row do not set a rowIndex.
   */
  rowIndex: number;
//#endregion SgMetaColumnDefinition

  get parsedWidth(): { value: number, type: 'px' | '%'} | undefined { return parseStyleWidth(this.width) } // TODO: cache

  stickyStart: boolean;
  stickyEnd: boolean;

  /**
   * Used by sg-table to apply a custom header/footer cell template, or the default when not set.
   * @internal
   */
  template: TemplateRef<SgTableMetaCellTemplateContext<any>>;

    /**
   * The calculated width, used by sg-table to set the width used by the tempalte
   * This value is not copied when creating a new instance
   * @internal
   */
  cWidth: string;
  /**
   * The calculated width, used by sg-table to set the width used by the tempalte
   * This value is not copied when creating a new instance
   * @internal
   */
  cMinWidth: string;

    /**
   * The column def for this column.
   */
  columnDef: SgTableColumnDef;

  constructor(def: SgMetaColumnDefinition) {
    initDefinitions(def, this);
    const copyKeys: Array<keyof SgMetaColumnDefinition> = ['kind', 'rowIndex'];
    copyKeys.forEach( k => k in def && (this[k] = def[k]) );

    if (def instanceof SgMetaColumn === false) {
      if (typeof def.type === 'string') {
        this.type = { name: def.type } as any;
      }
    }
  }
}
