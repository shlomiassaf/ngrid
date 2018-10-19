import { TemplateRef } from '@angular/core';

import { SgTableSorter } from '../../data-source/types';
import { SgTableColumnDef } from '../directives';
import { normalizeId, deepPathGet, deepPathSet } from '../utils';
import { SgColumnSizeInfo } from '../types';
import {
  SgColumnDefinition,
  SgTableMetaCellTemplateContext,
  SgTableCellTemplateContext,
  SgColumnTypeDefinition
} from './types';
import { initDefinitions, parseStyleWidth } from './utils';
import { SgColumnGroup } from './group-column';

export class SgColumn implements SgColumnDefinition {
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
  minWidth?: number;

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
  type?: SgColumnTypeDefinition;
  headerType?: SgColumnTypeDefinition;
  footerType?: SgColumnTypeDefinition;

  sort?: boolean | SgTableSorter;

  stickyStart: boolean;
  stickyEnd: boolean;

  /**
   * The original value of `prop`.
   * @internal
   */
  orgProp: string;

  /**
   * The calculated width, used by sg-table to set the width used by the template
   * This value is not copied when creating a new instance
   * @internal
   */
  cWidth: string;
  /**
   * The calculated width, used by sg-table to set the width used by the template
   * This value is not copied when creating a new instance
   * @internal
   */
  cMinWidth: string;

  /**
   * Used by sg-table to apply custom cell template, or the default when not set.
   * @internal
   */
  cellTpl: TemplateRef<SgTableCellTemplateContext<any>>;
  /**
   * Used by sg-table to apply a custom header cell template, or the default when not set.
   * @internal
   */
  headerCellTpl: TemplateRef<SgTableMetaCellTemplateContext<any>>;
  /**
   * Used by sg-table to apply a custom footer cell template, or the default when not set.
   * @internal
   */
  footerCellTpl: TemplateRef<SgTableMetaCellTemplateContext<any>>;

  /**
   * Used by the library as a logical flag representing the column hidden state.
   * This flag does not effect the UI, changing it will not change he hidden state in the UI.
   * Do not set this value manually.
   */
  hidden: boolean;

  /**
   * The column def for this column.
   */
  columnDef: SgTableColumnDef;

  /**
   * An on-demand size info object, populated by `SgColumnSizeObserver`
   */
  sizeInfo?: SgColumnSizeInfo;

  /**
   * Groups that this column belongs to.
   */
  private groups?: Set<SgColumnGroup>;

  constructor(def: SgColumnDefinition) {
    if (def instanceof SgColumn) {
      initDefinitions(def, this);
      this.prop = def.prop;
      this.path = def.path;
      this.orgProp = def.orgProp;
      if (def.groups) {
        this.groups = def.groups;
      }
    } else {
      const path = def.path || def.prop.split('.');
      const prop = path.pop();

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

    const copyKeys: Array<keyof SgColumn> = ['sort', 'minWidth', 'headerType', 'footerType'];
    copyKeys.forEach(k => k in def && (this[k as any] = def[k]));
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
  markInGroup(g: SgColumnGroup): void {
    if (!this.groups) {
      this.groups = new Set<SgColumnGroup>();
    }
    this.groups.add(g);
  }

  /**
   * Mark's that this column does not belong to the provided group.
   * > Note that this internal to the column and does not effect the group in any way.
   */
  markNotInGroup(g: SgColumnGroup): boolean {
    return this.groups && this.groups.delete(g);
  }

  isInGroup(g: SgColumnGroup): boolean {
    return this.groups && this.groups.has(g);
  }
}
