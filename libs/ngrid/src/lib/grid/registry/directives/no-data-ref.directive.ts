import { Directive, TemplateRef } from '@angular/core';

import { _PblNgridComponent } from '../../../tokens';
import { PblNgridRegistryService } from '../registry.service';
import { PblNgridSingleTemplateRegistry } from './single-template.directives';

/**
 * Marks the element as the display element when grid has no data.
 *
 * @example
 * ```html
 *   <pbl-ngrid>
 *     <div *pblNgridNoDataRef style="height: 100%; display: flex; align-items: center; justify-content: center">
 *       <span>No Data</span>
 *     </div>
 *   </pbl-ngrid>
 * ```
 */
@Directive({ selector: '[pblNgridNoDataRef]' })
export class PblNgridNoDataRefDirective extends PblNgridSingleTemplateRegistry<{ $implicit: _PblNgridComponent<any> }, 'noData'> {
  readonly kind: 'noData' = 'noData';
  constructor(tRef: TemplateRef<{ $implicit: _PblNgridComponent<any> }>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

declare module '@pebula/ngrid/core/lib/registry/types' {
  interface PblNgridSingleRegistryMap {
    noData?: PblNgridNoDataRefDirective;
  }
}
