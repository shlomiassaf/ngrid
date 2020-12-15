import { PblMetaRowDefinitions, PblColumnSet } from '@pebula/ngrid/core';
import { PblMetaColumn } from './meta-column';
import { PblColumn } from './column';
import { PblColumnGroup, PblColumnGroupStore } from './group-column';

/**
 * Represent a complete column set for a grid. (table, header, footer and headerGroup columns).
 *
 * `PblNgridColumnSet` contains runtime instances of for each column type (`PblColumn`, `PblMetaColumn` and `PblColumnGroup`)
 * which
 */
export interface PblNgridColumnSet {
  table: {
    header?: PblMetaRowDefinitions;
    footer?: PblMetaRowDefinitions;
    cols: PblColumn[];
  };
  header: PblColumnSet<PblMetaColumn>[];
  footer: PblColumnSet<PblMetaColumn>[];
  headerGroup: PblColumnSet<PblColumnGroup>[];
  groupStore: PblColumnGroupStore;
}

export interface PblColumnSizeInfo {
  column: PblColumn;
  height: number;
  width: number;
  style: CSSStyleDeclaration;
  updateSize(): void;
}
