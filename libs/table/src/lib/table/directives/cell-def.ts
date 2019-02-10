// tslint:disable:use-input-property-decorator
import {
  Directive,
  TemplateRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { COLUMN, PblColumnTypeDefinitionDataMap, PblColumn, PblMetaColumn } from '../columns';
import { PblTableCellContext, PblTableMetaCellContext } from '../context/index';
import { PblTableRegistryService } from '../services/table-registry.service';

export interface PblTableCellDefDirectiveBase {
  name: string;
  type: keyof PblColumnTypeDefinitionDataMap;
}

export abstract class PblTableBaseCellDef<Z> implements OnInit, OnDestroy, PblTableCellDefDirectiveBase {
  name: string;
  type: keyof PblColumnTypeDefinitionDataMap;

  constructor(public tRef: TemplateRef<Z>,
              protected registry: PblTableRegistryService) { }

  ngOnInit(): void {
    // TODO: listen to property changes (name) and re-register cell
    if (this instanceof PblTableHeaderCellDefDirective) {
      this.registry.addMulti('headerCell', this);
    } else if (this instanceof PblTableCellDefDirective) {
      this.registry.addMulti('tableCell', this);
    } else if (this instanceof PblTableEditorCellDefDirective) {
      this.registry.addMulti('editorCell', this);
    } else if (this instanceof PblTableFooterCellDefDirective) {
      this.registry.addMulti('footerCell', this);
    }
  }

  ngOnDestroy(): void {
    if (this instanceof PblTableHeaderCellDefDirective) {
      this.registry.removeMulti('headerCell', this);
    } else if (this instanceof PblTableCellDefDirective) {
      this.registry.removeMulti('tableCell', this);
    } else if (this instanceof PblTableEditorCellDefDirective) {
      this.registry.removeMulti('editorCell', this);
    } else if (this instanceof PblTableFooterCellDefDirective) {
      this.registry.removeMulti('footerCell', this);
    }
  }
}

/**
 * Header Cell definition for the pbl-table.
 * Captures the template of a column's data row header cell as well as header cell-specific properties.
 *
 * `negTableHeaderCellDef` does the same thing that `matHeaderCellDef` and `cdkHeaderCellDef` do with one difference,
 * `negTableHeaderCellDef` is independent and does not require a column definition parent, instead it accept the ID of
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
  selector: '[negTableHeaderCellDef], [negTableHeaderCellTypeDef]',
  inputs: [ 'name:negTableHeaderCellDef', 'type:negTableHeaderCellTypeDef' ]
})
export class PblTableHeaderCellDefDirective<T> extends PblTableBaseCellDef<PblTableMetaCellContext<T>> {
  constructor(tRef: TemplateRef<PblTableMetaCellContext<T>>, registry: PblTableRegistryService) { super(tRef, registry); }
}

/**
 * Cell definition for the pbl-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 *
 * `negTableCellDef` does the same thing that `matCellDef` and `cdkCellDef` do with one difference, `negTableCellDef` is
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
  selector: '[negTableCellDef], [negTableCellTypeDef]',
  inputs: [ 'name:negTableCellDef', 'type:negTableCellTypeDef' ]
})
export class PblTableCellDefDirective<T, P extends keyof PblColumnTypeDefinitionDataMap = any> extends PblTableBaseCellDef<PblTableCellContext<T, P>> {
  type: P;
  constructor(tRef: TemplateRef<PblTableCellContext<any, P>>, registry: PblTableRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[negTableCellEditorDef], [negTableCellEditorTypeDef]',
  inputs: [ 'name:negTableCellEditorDef', 'type:negTableCellEditorTypeDef' ]
})
export class PblTableEditorCellDefDirective<T, P extends keyof PblColumnTypeDefinitionDataMap = any> extends PblTableBaseCellDef<PblTableCellContext<T, P>> {
  type: P;
  constructor(tRef: TemplateRef<PblTableCellContext<any, P>>, registry: PblTableRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[negTableFooterCellDef], [negTableFooterCellTypeDef]',
  inputs: [ 'name:negTableFooterCellDef', 'type:negTableFooterCellTypeDef' ]
})
export class PblTableFooterCellDefDirective<T> extends PblTableBaseCellDef<PblTableMetaCellContext<T>> {
  constructor(tRef: TemplateRef<PblTableMetaCellContext<T>>, registry: PblTableRegistryService) { super(tRef, registry); }
}

function findCellDefById<T extends PblTableCellDefDirectiveBase>(cellDefs: Array<T>, colDef: Pick<PblMetaColumn, 'id' | 'type'>, searchParent?: boolean): T {
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

export function findCellDef<T = any>(registry: PblTableRegistryService, colDef: PblColumn, kind: 'tableCell' | 'editorCell',  searchParent?: boolean): PblTableCellDefDirective<T>;
export function findCellDef<T = any>(registry: PblTableRegistryService, colDef: PblMetaColumn | PblColumn, kind: 'headerCell', searchParent?: boolean): PblTableHeaderCellDefDirective<T>;
export function findCellDef<T = any>(registry: PblTableRegistryService, colDef: PblMetaColumn | PblColumn, kind: 'footerCell', searchParent?: boolean): PblTableFooterCellDefDirective<T>;
export function findCellDef<T = any>(registry: PblTableRegistryService, colDef: COLUMN, kind: 'headerCell' | 'footerCell' | 'tableCell' | 'editorCell', searchParent?: boolean): PblTableCellDefDirective<T> | PblTableHeaderCellDefDirective<T> | PblTableFooterCellDefDirective <T> {
  const cellDefs: PblTableCellDefDirectiveBase[] = registry.getMulti(kind);

  if (cellDefs) {
    let type: Pick<PblMetaColumn, 'id' | 'type'>;
    if (colDef instanceof PblColumn) {
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

