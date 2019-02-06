import { Directive, TemplateRef } from '@angular/core';
import { NegTableRegistryService, NegTableMultiTemplateRegistry, NegTableDataHeaderExtensionRef, NegTableDataHeaderExtensionContext } from '@neg/table';

/**
 * Marks the element as the resizer template for cells.
 */
@Directive({ selector: '[negTableCellResizerRef]' })
export class NegTableCellResizerRefDirective extends NegTableMultiTemplateRegistry<NegTableDataHeaderExtensionContext, 'dataHeaderExtensions'> implements NegTableDataHeaderExtensionRef {
  readonly name: 'cellResizer' = 'cellResizer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';

  constructor(tRef: TemplateRef<NegTableDataHeaderExtensionContext>, registry: NegTableRegistryService) { super(tRef, registry); }

  shouldRender(context: NegTableDataHeaderExtensionContext): boolean {
    return !!context.col.resize;
  }
}
