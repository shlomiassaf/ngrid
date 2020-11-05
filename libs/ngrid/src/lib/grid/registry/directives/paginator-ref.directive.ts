import { Directive, TemplateRef } from '@angular/core';

import { PblNgridComponent } from '../../ngrid.component';
import { PblNgridRegistryService } from '../registry.service';
import { PblNgridSingleTemplateRegistry } from './single-template.directives';

/**
 * Marks the element as the display element for pagination
 */
@Directive({ selector: '[pblNgridPaginatorRef]' })
export class PblNgridPaginatorRefDirective extends PblNgridSingleTemplateRegistry<{ $implicit: PblNgridComponent<any> }, 'paginator'> {
  readonly kind: 'paginator' = 'paginator';
  constructor(tRef: TemplateRef<{ $implicit: PblNgridComponent<any> }>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

declare module '../types' {
  interface PblNgridSingleRegistryMap {
    paginator?: PblNgridPaginatorRefDirective;
  }
}
