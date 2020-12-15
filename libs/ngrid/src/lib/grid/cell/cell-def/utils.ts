import { PblNgridRegistryService } from '@pebula/ngrid/core';

import { PblColumn, PblMetaColumn, COLUMN, isPblColumn } from '../../column/model';
import { PblNgridHeaderCellDefDirective } from './header-cell-def.directive';
import { PblNgridCellDefDirective } from './cell-def.directive';
import { PblNgridFooterCellDefDirective } from './footer-cell-def.directive';
import { PblNgridCellDefDirectiveBase } from './types';

export function findCellDefById<T extends PblNgridCellDefDirectiveBase>(cellDefs: Array<T>, colDef: Pick<PblMetaColumn, 'id' | 'type'>, searchParent?: boolean): T {
  for (const cellDef of cellDefs) {
    if (cellDef.type) {
      if (colDef.type && cellDef.type === colDef.type.name) {
        return cellDef;
      }
    } else {
      const id = cellDef.name;
      if (id === colDef.id) {
        return cellDef;
      }
    }
  }
}

export function findCellDef<T = any>(registry: PblNgridRegistryService, colDef: PblColumn, kind: 'tableCell' | 'editorCell',  searchParent?: boolean): PblNgridCellDefDirective<T>;
export function findCellDef<T = any>(registry: PblNgridRegistryService, colDef: PblMetaColumn | PblColumn, kind: 'headerCell', searchParent?: boolean): PblNgridHeaderCellDefDirective<T>;
export function findCellDef<T = any>(registry: PblNgridRegistryService, colDef: PblMetaColumn | PblColumn, kind: 'footerCell', searchParent?: boolean): PblNgridFooterCellDefDirective<T>;
export function findCellDef<T = any>(registry: PblNgridRegistryService, colDef: COLUMN, kind: 'headerCell' | 'footerCell' | 'tableCell' | 'editorCell', searchParent?: boolean): PblNgridCellDefDirective<T> | PblNgridHeaderCellDefDirective<T> | PblNgridFooterCellDefDirective <T> {
  const cellDefs: PblNgridCellDefDirectiveBase[] = registry.getMulti(kind);

  if (cellDefs) {
    let type: Pick<PblMetaColumn, 'id' | 'type'>;
    if (isPblColumn(colDef)) {
      switch (kind) {
        case 'headerCell':
          if (colDef.headerType) {
            type = { id: colDef.id, type: colDef.headerType };
          }
          break;
        case 'footerCell':
          if (colDef.footerType) {
            type = { id: colDef.id, type: colDef.footerType };
          }
          break;
      }
    }
    if (!type) {
      type = colDef;
    }
    const match: any = findCellDefById(cellDefs, type);
    if (match) {
      return match;
    }
  }

  if (searchParent && registry.parent) {
    return findCellDef(registry.parent, colDef as any, kind as any, searchParent);
  }
}

