import { Directive, TemplateRef } from '@angular/core';

import { _PblNgridComponent } from '../../../tokens';
import { PblNgridRegistryService } from '../registry.service';
import { PblNgridSingleTemplateRegistry } from './single-template.directives';

/**
 * Marks the element as the display element for pagination
 */
@Directive({ selector: '[pblNgridPaginatorRef]' })
export class PblNgridPaginatorRefDirective extends PblNgridSingleTemplateRegistry<{ $implicit: _PblNgridComponent<any> }, 'paginator'> {
  readonly kind: 'paginator' = 'paginator';
  constructor(tRef: TemplateRef<{ $implicit: _PblNgridComponent<any> }>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

declare module '@pebula/ngrid/core/lib/registry/types' {
  interface PblNgridSingleRegistryMap {
    paginator?: PblNgridPaginatorRefDirective;
  }
}
