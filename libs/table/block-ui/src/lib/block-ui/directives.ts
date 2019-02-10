// tslint:disable:use-host-property-decorator
import { Directive, TemplateRef } from '@angular/core';
import { PblTableComponent, PblTableRegistryService, PblTableSingleTemplateRegistry } from '@pebula/table';

declare module '@pebula/table/lib/table/services/table-registry.service' {
  interface PblTableSingleRegistryMap {
    blocker?: PblTableBlockUiDefDirective;
  }
}

/**
 * Marks the element as the display element when the form is busy.
 */
@Directive({ selector: '[pblTableBlockUiDef]' })
export class PblTableBlockUiDefDirective extends PblTableSingleTemplateRegistry<{ $implicit: PblTableComponent<any> }, 'blocker'> {
  readonly kind = 'blocker';
  constructor(tRef: TemplateRef<{ $implicit: PblTableComponent<any> }>, registry: PblTableRegistryService) { super(tRef, registry); }
}
