// tslint:disable:use-input-property-decorator
import { Directive, TemplateRef } from '@angular/core';

import { PblColumnTypeDefinitionDataMap } from '../../column/model';
import { PblNgridCellContext } from '../../context/index';
import { PblNgridRegistryService } from '../../registry/registry.service';
import { PblNgridBaseCellDef } from './base-cell-def.directive';

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

  ngOnInit(): void {
    // TODO: listen to property changes (name) and re-register cell
    this.registry.addMulti('tableCell', this);
  }

  ngOnDestroy(): void {
    this.registry.removeMulti('tableCell', this);
  }
}

declare module '../../registry/types' {
  interface PblNgridMultiRegistryMap {
    tableCell?: PblNgridCellDefDirective<any>;
  }
}
