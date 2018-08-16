// tslint:disable:use-host-property-decorator
import { Directive, TemplateRef } from '@angular/core';
import { SgTableComponent, SgTableRegistryService, SgTableSingleTemplateRegistryDirective } from '@sac/table';

declare module '../../../../src/lib/table/table-registry.service' {
  interface SgTableSingleRegistryMap {
    blocker?: SgTableBlockUiDefDirective;
  }
}

/**
 * Marks the element as the display element when the form is busy.
 */
@Directive({ selector: '[sgTableBlockUiDef]' })
export class SgTableBlockUiDefDirective extends SgTableSingleTemplateRegistryDirective<{ $implicit: SgTableComponent<any> }, 'blocker'> {
  readonly kind = 'blocker';
  constructor(tRef: TemplateRef<{ $implicit: SgTableComponent<any> }>, registry: SgTableRegistryService) { super(tRef, registry); }
}
