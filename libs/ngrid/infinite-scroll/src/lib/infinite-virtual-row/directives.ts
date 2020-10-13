// tslint:disable:use-host-property-decorator
import {
  Directive,
  IterableDiffers,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { CdkRowDef } from '@angular/cdk/table';

import { PblNgridRegistryService, PblNgridRowContext } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/grid/services/grid-registry.service' {
  interface PblNgridSingleRegistryMap {
    infiniteVirtualRow?: PblNgridInfiniteVirtualRowRefDirective;
  }
}

@Directive({
  selector: '[pblNgridInfiniteVirtualRowRef]',
  inputs: ['columns: pblNgridInfiniteVirtualRowRefColumns', 'when: pblNgridInfiniteVirtualRowRefWhen'],
})
export class PblNgridInfiniteVirtualRowRefDirective<T = any> extends CdkRowDef<T> implements OnInit, OnDestroy {

  constructor(template: TemplateRef<PblNgridRowContext<T>>, _differs: IterableDiffers, protected registry: PblNgridRegistryService) {
    super(template, _differs);
  }

  clone(): PblNgridInfiniteVirtualRowRefDirective<T> {
    const clone = Object.create(this);
    clone.columns = this.columns;
    clone._columnsDiffer = undefined;
    // this._columnsDiffer = this.columns = undefined;
    return clone;
  }

  ngOnInit(): void {
    this.registry.setSingle('infiniteVirtualRow', this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle('infiniteVirtualRow',  undefined);
  }
}
