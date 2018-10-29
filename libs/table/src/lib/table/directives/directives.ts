// tslint:disable:use-host-property-decorator

import { Directive, TemplateRef } from '@angular/core';

import { NegTableComponent } from '../table.component';
import { NegTableSingleRegistryMap, NegTableRegistryService } from '../table-registry.service';

export abstract class NegTableSingleTemplateRegistryDirective<T, TKind extends keyof NegTableSingleRegistryMap> {
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: NegTableRegistryService) { }

  ngOnInit(): void {
    this.registry.setSingle(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle(this.kind,  undefined);
  }
}

/**
 * Marks the element as the display element for pagination
 */
@Directive({ selector: '[negTablePaginatorRef]' })
export class NegTablePaginatorRefDirective extends NegTableSingleTemplateRegistryDirective<{ $implicit: NegTableComponent<any> }, 'paginator'> {
  readonly kind: 'paginator' = 'paginator';
  constructor(tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>, registry: NegTableRegistryService) { super(tRef, registry); }
}

/**
 * Marks the element as the display element when table has no data.
 *
 * @example
 * ```html
 *   <neg-table>
 *     <div *negTableNoDataRef style="height: 100%; display: flex; align-items: center; justify-content: center">
 *       <span>No Data</span>
 *     </div>
 *   </neg-table>
 * ```
 */
@Directive({ selector: '[negTableNoDataRef]' })
export class NegTableNoDataRefDirective extends NegTableSingleTemplateRegistryDirective<{ $implicit: NegTableComponent<any> }, 'noData'> {
  readonly kind: 'noData' = 'noData';
  constructor(tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>, registry: NegTableRegistryService) { super(tRef, registry); }
}

