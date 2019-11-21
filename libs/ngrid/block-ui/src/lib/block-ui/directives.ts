// tslint:disable:use-host-property-decorator
import { Directive, TemplateRef } from '@angular/core';
import { PblNgridComponent, PblNgridRegistryService, PblNgridSingleTemplateRegistry } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/grid/services/grid-registry.service' {
  interface PblNgridSingleRegistryMap {
    blocker?: PblNgridBlockUiDefDirective;
  }
}

/**
 * Marks the element as the display element when the form is busy.
 */
@Directive({ selector: '[pblNgridBlockUiDef]' })
export class PblNgridBlockUiDefDirective extends PblNgridSingleTemplateRegistry<{ $implicit: PblNgridComponent<any> }, 'blocker'> {
  readonly kind = 'blocker';
  constructor(tRef: TemplateRef<{ $implicit: PblNgridComponent<any> }>, registry: PblNgridRegistryService) { super(tRef, registry); }
}
