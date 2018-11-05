import { Directive, TemplateRef } from '@angular/core';
import { NegColumn, NegTableRegistryService, NegTableMetaCellContext, NegTableMultiTemplateRegistry, NegTableDataHeaderExtensionRef } from '@neg/table';

/**
 * Marks the element as the resizer template for cells.
 */
@Directive({ selector: '[negTableCellResizerRef]' })
export class NegTableCellResizerRefDirective extends NegTableMultiTemplateRegistry<NegTableMetaCellContext<any>, 'dataHeaderExtensions'> implements NegTableDataHeaderExtensionRef {
  readonly name: 'cellResizer' = 'cellResizer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';

  constructor(tRef: TemplateRef<NegTableMetaCellContext<any>>, registry: NegTableRegistryService) { super(tRef, registry); }

  shouldRender(context: NegTableMetaCellContext<any>): boolean {
    const col = context.col as NegColumn;
    return !!col.resize;
  }
}
