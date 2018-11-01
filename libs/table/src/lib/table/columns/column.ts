import { TemplateRef } from '@angular/core';

import { NegTableSorter } from '../../data-source/types';
import { NegTableColumnDef } from '../directives';
import { normalizeId, deepPathGet, deepPathSet } from '../utils';
import { NegColumnSizeInfo } from '../types';
import {
  NegColumnDefinition,
  NegTableMetaCellTemplateContext,
  NegTableCellTemplateContext,
  NegColumnTypeDefinition
} from './types';
import { initDefinitions, parseStyleWidth } from './utils';
import { NegColumnGroup } from './group-column';

const NEG_COLUMN_MARK = Symbol('NegColumn');

export function isNegColumn(def: any): def is NegColumn {
  return def instanceof NegColumn || def[NEG_COLUMN_MARK] === true;
}

export class NegColumn implements NegColumnDefinition {
  id: string;
  label?: string;

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
  data: any = {};

  get parsedWidth(): { value: number; type: 'px' | '%' } | undefined {
    return parseStyleWidth(this.width);
  } // TODO: cache

  /**
   * The property to display (from the row element)
   * You can use dot notation to display deep paths.
   */
  prop: string;

  /**
   * A path to a nested object, relative to the row element.
   * The table will display `prop` from the object referenced by `path`.
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

  /**
   * The type of the values in this column.
   * This is an additional level for matching columns to templates, grouping templates for a type.
   */
  type?: NegColumnTypeDefinition;
  headerType?: NegColumnTypeDefinition;
  footerType?: NegColumnTypeDefinition;

  sort?: boolean | NegTableSorter;

  stickyStart: boolean;
  stickyEnd: boolean;

  /**
   * The original value of `prop`.
   * @internal
   */
  orgProp: string;

  /**
   * Used by neg-table to apply custom cell template, or the default when not set.
   * @internal
   */
  cellTpl: TemplateRef<NegTableCellTemplateContext<any>>;
  /**
   * Used by neg-table to apply a custom header cell template, or the default when not set.
   * @internal
   */
  headerCellTpl: TemplateRef<NegTableMetaCellTemplateContext<any>>;
  /**
   * Used by neg-table to apply a custom footer cell template, or the default when not set.
   * @internal
   */
  footerCellTpl: TemplateRef<NegTableMetaCellTemplateContext<any>>;

  /**
   * Used by the library as a logical flag representing the column hidden state.
   * This flag does not effect the UI, changing it will not change he hidden state in the UI.
   * Do not set this value manually.
   */
  hidden: boolean;

  /**
   * An on-demand size info object, populated by `NegColumnSizeObserver`
   * @internal
   */
  sizeInfo?: NegColumnSizeInfo;

  /** @internal */
  maxWidthLock: boolean;

  /**
   * The column def for this column.
   */
  get columnDef(): NegTableColumnDef<NegColumn> { return this._columnDef; }

  private _columnDef: NegTableColumnDef<NegColumn>;
  private defaultWidth: string = '';

  /**
   * Groups that this column belongs to.
   */
  private groups?: Set<NegColumnGroup>;

  constructor(def: NegColumnDefinition) {
    this[NEG_COLUMN_MARK] = true;

    if (isNegColumn(def)) {
      initDefinitions(def, this);
      this.prop = def.prop;
      this.path = def.path;
      this.orgProp = def.orgProp;
      if (def.groups) {
        this.groups = def.groups;
      }
    } else {
      const path = def.path || def.prop.split('.');
      const prop = def.path ? def.prop : path.pop();

      def = Object.create(def);
      def.id = normalizeId(def.id || def.prop || def.label);
      def.label = 'label' in def ? def.label : prop;

      if (typeof def.type === 'string') {
        def.type = { name: def.type } as any;
      }
      if (typeof def.headerType === 'string') {
        def.headerType = { name: def.headerType } as any;
      }
      if (typeof def.footerType === 'string') {
        def.footerType = { name: def.footerType } as any;
      }

      initDefinitions(def, this);

      this.prop = prop;
      this.orgProp = def.prop;
      if (path.length) {
        this.path = path;
      }
    }

    const copyKeys: Array<keyof NegColumn> = ['sort', 'headerType', 'footerType'];
    copyKeys.forEach(k => k in def && (this[k as any] = def[k]));
  }

  attach(columnDef: NegTableColumnDef<NegColumn>): void {
    this.detach();
    this._columnDef = columnDef;
    if (this.defaultWidth) {
      this.columnDef.updateWidth(this.width || this.defaultWidth);
    }
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

  /**
   * Get the value this column points to in the provided row
   */
  getValue<T = any>(row: any): T {
    return deepPathGet(row, this);
  }

  /**
   * Set a value in the provided row where this column points to
   */
  setValue(row: any, value: any): void {
    return deepPathSet(row, this, value);
  }

  /**
   * Mark's that this column belong to the provided group.
   * > Note that this internal to the column and does not effect the group in any way.
   */
  markInGroup(g: NegColumnGroup): void {
    if (!this.groups) {
      this.groups = new Set<NegColumnGroup>();
    }
    this.groups.add(g);
  }

  /**
   * Mark's that this column does not belong to the provided group.
   * > Note that this internal to the column and does not effect the group in any way.
   */
  markNotInGroup(g: NegColumnGroup): boolean {
    return this.groups && this.groups.delete(g);
  }

  isInGroup(g: NegColumnGroup): boolean {
    return this.groups && this.groups.has(g);
  }

  /**
   * Calculates if the column width is locked by a maximum by checking if the given width is equal to the max width.
   * If the result of the calculation (true/false) does not equal the previous lock state it will set the new lock state
   * and return true.
   * Otherwise return false.
   * @internal
   */
  checkMaxWidthLock(actualWidth: number): boolean {
    if (actualWidth === this.maxWidth) {
      if (!this.maxWidthLock) {
        this.maxWidthLock = true;
        return true;
      }
    } else if (this.maxWidthLock) {
      this.maxWidthLock = false;
      return true;
    }
    return false;
  }
}
