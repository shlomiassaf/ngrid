// tslint:disable:use-host-property-decorator
import { Directive, TemplateRef } from '@angular/core';
import { NegTableComponent, NegTableRegistryService, NegTableSingleTemplateRegistryDirective } from '@neg/table';

// declare module '../../../../src/lib/table/table-registry.service' {
declare module '@neg/table/lib/table/table-registry.service' {
  interface NegTableSingleRegistryMap {
    blocker?: NegTableBlockUiDefDirective;
  }
}

/**
 * Marks the element as the display element when the form is busy.
 */
@Directive({ selector: '[negTableBlockUiDef]' })
export class NegTableBlockUiDefDirective extends NegTableSingleTemplateRegistryDirective<{ $implicit: NegTableComponent<any> }, 'blocker'> {
  readonly kind = 'blocker';
  constructor(tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>, registry: NegTableRegistryService) { super(tRef, registry); }
}
