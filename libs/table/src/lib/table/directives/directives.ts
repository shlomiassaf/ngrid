// tslint:disable:use-host-property-decorator

import {
  ChangeDetectorRef,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

import { SgTableComponent } from '../table.component';
import { SgTableSingleRegistryMap, SgTableRegistryService } from '../table-registry.service';

export abstract class SgTableSingleTemplateRegistryDirective<T, TKind extends keyof SgTableSingleRegistryMap> {
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: SgTableRegistryService) { }

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
@Directive({ selector: '[sgTablePaginatorRef]' })
export class SgTablePaginatorRefDirective extends SgTableSingleTemplateRegistryDirective<{ $implicit: SgTableComponent<any> }, 'paginator'> {
  readonly kind = 'paginator';
  constructor(tRef: TemplateRef<{ $implicit: SgTableComponent<any> }>, registry: SgTableRegistryService) { super(tRef, registry); }
}

/**
 * Marks the element as the display element when table has no data.
 *
 * @example
 * ```html
 *   <sg-table>
 *     <div *sgTableNoDataRef style="height: 100%; display: flex; align-items: center; justify-content: center">
 *       <span>No Data</span>
 *     </div>
 *   </sg-table>
 * ```
 */
@Directive({ selector: '[sgTableNoDataRef]' })
export class SgTableNoDataRefDirective extends SgTableSingleTemplateRegistryDirective<{ $implicit: SgTableComponent<any> }, 'noData'> {
  readonly kind = 'noData';
  constructor(tRef: TemplateRef<{ $implicit: SgTableComponent<any> }>, registry: SgTableRegistryService) { super(tRef, registry); }
}

