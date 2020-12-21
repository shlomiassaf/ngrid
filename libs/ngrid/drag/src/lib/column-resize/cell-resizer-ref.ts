import { Directive, TemplateRef } from '@angular/core';
import { PblNgridRegistryService, PblNgridMultiTemplateRegistry, PblNgridDataHeaderExtensionRef, PblNgridDataHeaderExtensionContext } from '@pebula/ngrid';

/**
 * Marks the element as the resizer template for cells.
 */
@Directive({ selector: '[pblNgridCellResizerRef]' })
export class PblNgridCellResizerRefDirective extends PblNgridMultiTemplateRegistry<PblNgridDataHeaderExtensionContext, 'dataHeaderExtensions'> implements PblNgridDataHeaderExtensionRef {
  readonly name: 'cellResizer' = 'cellResizer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';

  constructor(tRef: TemplateRef<PblNgridDataHeaderExtensionContext>, registry: PblNgridRegistryService) { super(tRef, registry); }

  shouldRender(context: PblNgridDataHeaderExtensionContext): boolean {
    return !!context.col.resize;
  }
}
