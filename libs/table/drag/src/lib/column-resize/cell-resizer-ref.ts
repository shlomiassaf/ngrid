import { Directive, TemplateRef } from '@angular/core';
import { PblTableRegistryService, PblTableMultiTemplateRegistry, PblTableDataHeaderExtensionRef, PblTableDataHeaderExtensionContext } from '@pebula/table';

/**
 * Marks the element as the resizer template for cells.
 */
@Directive({ selector: '[pblTableCellResizerRef]' })
export class PblTableCellResizerRefDirective extends PblTableMultiTemplateRegistry<PblTableDataHeaderExtensionContext, 'dataHeaderExtensions'> implements PblTableDataHeaderExtensionRef {
  readonly name: 'cellResizer' = 'cellResizer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';

  constructor(tRef: TemplateRef<PblTableDataHeaderExtensionContext>, registry: PblTableRegistryService) { super(tRef, registry); }

  shouldRender(context: PblTableDataHeaderExtensionContext): boolean {
    return !!context.col.resize;
  }
}
