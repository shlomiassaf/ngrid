// tslint:disable:use-input-property-decorator
import {
  Directive,
  TemplateRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { COLUMN, NegColumnTypeDefinitionDataMap, NegColumn, NegMetaColumn } from '../columns';
import { NegTableCellContext, NegTableMetaCellContext } from '../context/index';
import { NegTableRegistryService } from '../services/table-registry.service';

export interface NegTableCellDefDirectiveBase {
  name: string;
  type: keyof NegColumnTypeDefinitionDataMap;
}

export abstract class NegTableBaseCellDef<Z> implements OnInit, OnDestroy, NegTableCellDefDirectiveBase {
  name: string;
  type: keyof NegColumnTypeDefinitionDataMap;

  constructor(public tRef: TemplateRef<Z>,
              protected registry: NegTableRegistryService) { }

  ngOnInit(): void {
    // TODO: listen to property changes (name) and re-register cell
    if (this instanceof NegTableHeaderCellDefDirective) {
      this.registry.addMulti('headerCell', this);
    } else if (this instanceof NegTableCellDefDirective) {
      this.registry.addMulti('tableCell', this);
    } else if (this instanceof NegTableEditorCellDefDirective) {
      this.registry.addMulti('editorCell', this);
    } else if (this instanceof NegTableFooterCellDefDirective) {
      this.registry.addMulti('footerCell', this);
    }
  }

  ngOnDestroy(): void {
    if (this instanceof NegTableHeaderCellDefDirective) {
      this.registry.removeMulti('headerCell', this);
    } else if (this instanceof NegTableCellDefDirective) {
      this.registry.removeMulti('tableCell', this);
    } else if (this instanceof NegTableEditorCellDefDirective) {
      this.registry.removeMulti('editorCell', this);
    } else if (this instanceof NegTableFooterCellDefDirective) {
      this.registry.removeMulti('footerCell', this);
    }
  }
}

/**
 * Header Cell definition for the neg-table.
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
export class NegTableHeaderCellDefDirective<T> extends NegTableBaseCellDef<NegTableMetaCellContext<T>> {
  constructor(tRef: TemplateRef<NegTableMetaCellContext<T>>, registry: NegTableRegistryService) { super(tRef, registry); }
}

/**
 * Cell definition for the neg-table.
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
export class NegTableCellDefDirective<T, P extends keyof NegColumnTypeDefinitionDataMap = any> extends NegTableBaseCellDef<NegTableCellContext<T, P>> {
  type: P;
  constructor(tRef: TemplateRef<NegTableCellContext<any, P>>, registry: NegTableRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[negTableCellEditorDef], [negTableCellEditorTypeDef]',
  inputs: [ 'name:negTableCellEditorDef', 'type:negTableCellEditorTypeDef' ]
})
export class NegTableEditorCellDefDirective<T, P extends keyof NegColumnTypeDefinitionDataMap = any> extends NegTableBaseCellDef<NegTableCellContext<T, P>> {
  type: P;
  constructor(tRef: TemplateRef<NegTableCellContext<any, P>>, registry: NegTableRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[negTableFooterCellDef], [negTableFooterCellTypeDef]',
  inputs: [ 'name:negTableFooterCellDef', 'type:negTableFooterCellTypeDef' ]
})
export class NegTableFooterCellDefDirective<T> extends NegTableBaseCellDef<NegTableMetaCellContext<T>> {
  constructor(tRef: TemplateRef<NegTableMetaCellContext<T>>, registry: NegTableRegistryService) { super(tRef, registry); }
}

function findCellDefById<T extends NegTableCellDefDirectiveBase>(cellDefs: Array<T>, colDef: Pick<NegMetaColumn, 'id' | 'type'>, searchParent?: boolean): T {
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

export function findCellDef<T = any>(registry: NegTableRegistryService, colDef: NegColumn, kind: 'tableCell' | 'editorCell',  searchParent?: boolean): NegTableCellDefDirective<T>;
export function findCellDef<T = any>(registry: NegTableRegistryService, colDef: NegMetaColumn | NegColumn, kind: 'headerCell', searchParent?: boolean): NegTableHeaderCellDefDirective<T>;
export function findCellDef<T = any>(registry: NegTableRegistryService, colDef: NegMetaColumn | NegColumn, kind: 'footerCell', searchParent?: boolean): NegTableFooterCellDefDirective<T>;
export function findCellDef<T = any>(registry: NegTableRegistryService, colDef: COLUMN, kind: 'headerCell' | 'footerCell' | 'tableCell' | 'editorCell', searchParent?: boolean): NegTableCellDefDirective<T> | NegTableHeaderCellDefDirective<T> | NegTableFooterCellDefDirective <T> {
  const cellDefs: NegTableCellDefDirectiveBase[] = registry.getMulti(kind);

  if (cellDefs) {
    let type: Pick<NegMetaColumn, 'id' | 'type'>;
    if (colDef instanceof NegColumn) {
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

