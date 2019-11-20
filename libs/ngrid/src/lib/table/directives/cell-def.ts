// tslint:disable:use-input-property-decorator
import {
  Directive,
  TemplateRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { COLUMN, PblColumnTypeDefinitionDataMap, PblColumn, PblMetaColumn, isPblColumn } from '../columns';
import { PblNgridCellContext, PblNgridMetaCellContext } from '../context/index';
import { PblNgridRegistryService } from '../services/table-registry.service';

export interface PblNgridCellDefDirectiveBase {
  name: string;
  type: keyof PblColumnTypeDefinitionDataMap;
}

export abstract class PblNgridBaseCellDef<Z> implements OnInit, OnDestroy, PblNgridCellDefDirectiveBase {
  name: string;
  type: keyof PblColumnTypeDefinitionDataMap;

  constructor(public tRef: TemplateRef<Z>,
              protected registry: PblNgridRegistryService) { }

  ngOnInit(): void {
    // TODO: listen to property changes (name) and re-register cell
    if (this instanceof PblNgridHeaderCellDefDirective) {
      this.registry.addMulti('headerCell', this);
    } else if (this instanceof PblNgridCellDefDirective) {
      this.registry.addMulti('tableCell', this);
    } else if (this instanceof PblNgridEditorCellDefDirective) {
      this.registry.addMulti('editorCell', this);
    } else if (this instanceof PblNgridFooterCellDefDirective) {
      this.registry.addMulti('footerCell', this);
    }
  }

  ngOnDestroy(): void {
    if (this instanceof PblNgridHeaderCellDefDirective) {
      this.registry.removeMulti('headerCell', this);
    } else if (this instanceof PblNgridCellDefDirective) {
      this.registry.removeMulti('tableCell', this);
    } else if (this instanceof PblNgridEditorCellDefDirective) {
      this.registry.removeMulti('editorCell', this);
    } else if (this instanceof PblNgridFooterCellDefDirective) {
      this.registry.removeMulti('footerCell', this);
    }
  }
}

/**
 * Header Cell definition for the pbl-ngrid.
 * Captures the template of a column's data row header cell as well as header cell-specific properties.
 *
 * `pblNgridHeaderCellDef` does the same thing that `matHeaderCellDef` and `cdkHeaderCellDef` do with one difference,
 * `pblNgridHeaderCellDef` is independent and does not require a column definition parent, instead it accept the ID of
 * the header cell.
 *
 * NOTE: Defining '*' as id will declare the header cell template as default, replacing the table's default header cell template.
 *
 * Make sure you set the proper id of the property you want to override.
 * When the `id` is set explicitly in the table column definition, this is not a problem but when if it's not set
 * the table generates a unique id based on a logic. If `name` is set the name is used, if no name is set
 * the `prop` is used (full with dot notation).
 */
@Directive({
  selector: '[pblNgridHeaderCellDef], [pblNgridHeaderCellTypeDef]',
  inputs: [
    'name:pblNgridHeaderCellDef',
    'type:pblNgridHeaderCellTypeDef',
  ]
})
export class PblNgridHeaderCellDefDirective<T> extends PblNgridBaseCellDef<PblNgridMetaCellContext<T>> {
  constructor(tRef: TemplateRef<PblNgridMetaCellContext<T>>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

/**
 * Cell definition for the pbl-ngrid.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 *
 * `pblNgridCellDef` does the same thing that `matCellDef` and `cdkCellDef` do with one difference, `pblNgridCellDef` is
 * independent and does not require a column definition parent, instead it accept the ID of the cell.
 *
 * NOTE: Defining '*' as id will declare the cell template as default, replacing the table's default cell template.
 *
 * Make sure you set the proper id of the property you want to override.
 * When the `id` is set explicitly in the table column definition, this is not a problem but when if it's not set
 * the table generates a unique id based on a logic. If `name` is set the name is used, if no name is set
 * the `prop` is used (full with dot notation).
 */
@Directive({
  selector: '[pblNgridCellDef], [pblNgridCellTypeDef]',
  inputs: [
    'name:pblNgridCellDef',
    'type:pblNgridCellTypeDef',
  ]
})
export class PblNgridCellDefDirective<T, P extends keyof PblColumnTypeDefinitionDataMap = any> extends PblNgridBaseCellDef<PblNgridCellContext<T, P>> {
  type: P;
  constructor(tRef: TemplateRef<PblNgridCellContext<any, P>>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[pblNgridCellEditorDef], [pblNgridCellEditorTypeDef]',
  inputs: [
    'name:pblNgridCellEditorDef',
    'type:pblNgridCellEditorTypeDef',
  ]
})
export class PblNgridEditorCellDefDirective<T, P extends keyof PblColumnTypeDefinitionDataMap = any> extends PblNgridBaseCellDef<PblNgridCellContext<T, P>> {
  type: P;
  constructor(tRef: TemplateRef<PblNgridCellContext<any, P>>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[pblNgridFooterCellDef], [pblNgridFooterCellTypeDef]',
  inputs: [
    'name:pblNgridFooterCellDef',
    'type:pblNgridFooterCellTypeDef',
  ]
})
export class PblNgridFooterCellDefDirective<T> extends PblNgridBaseCellDef<PblNgridMetaCellContext<T>> {
  constructor(tRef: TemplateRef<PblNgridMetaCellContext<T>>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

function findCellDefById<T extends PblNgridCellDefDirectiveBase>(cellDefs: Array<T>, colDef: Pick<PblMetaColumn, 'id' | 'type'>, searchParent?: boolean): T {
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

