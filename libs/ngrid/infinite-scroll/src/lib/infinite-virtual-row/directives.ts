// tslint:disable:use-host-property-decorator
import {
  Directive,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { PblNgridRowDef } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/grid/registry/types' {
  interface PblNgridSingleRegistryMap {
    infiniteVirtualRow?: PblNgridInfiniteVirtualRowRefDirective;
  }
}

@Directive({
  selector: '[pblNgridInfiniteVirtualRowDef]',
  inputs: ['columns: pblNgridInfiniteVirtualRowDefColumns', 'when: pblNgridInfiniteVirtualRowDefWhen'],
})
export class PblNgridInfiniteVirtualRowRefDirective<T = any> extends PblNgridRowDef<T> implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registry.setSingle('infiniteVirtualRow', this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle('infiniteVirtualRow',  undefined);
  }
}
