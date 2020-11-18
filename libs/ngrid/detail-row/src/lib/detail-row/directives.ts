// tslint:disable:use-host-property-decorator
import {
  Component,
  Directive,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';

import { PblNgridRegistryService, PblNgridSingleTemplateRegistry, PblNgridRowContext, PblNgridRowDef } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/grid/registry/types' {
  interface PblNgridSingleRegistryMap {
    detailRowParent?: PblNgridDetailRowParentRefDirective<any>;
    detailRow?: PblNgridDetailRowDefDirective;
  }
}

/**
 * Marks the element as the display element for the detail row itself.
 */
@Directive({ selector: '[pblNgridDetailRowDef]' })
export class PblNgridDetailRowDefDirective extends PblNgridSingleTemplateRegistry<PblNgridRowContext<any>, 'detailRow'> {
  readonly kind: 'detailRow' = 'detailRow';
  constructor(tRef: TemplateRef<PblNgridRowContext<any>>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[pblNgridDetailRowParentRef]',
  inputs: ['columns: pblNgridDetailRowParentRef', 'when: pblNgridDetailRowParentRefWhen'],
})
export class PblNgridDetailRowParentRefDirective<T> extends PblNgridRowDef<T> implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registry.setSingle('detailRowParent', this as any);
  }

  ngOnDestroy(): void {
    if (this.registry.getSingle('detailRowParent') === this) {
      this.registry.setSingle('detailRowParent',  undefined);
    }
  }
}

/**
 * Use to set the a default `pblNgridDetailRowParentRef` if the user did not set one.
 * @internal
 */
@Component({
  selector: 'pbl-ngrid-default-detail-row-parent',
  template: `<pbl-ngrid-row *pblNgridDetailRowParentRef="let row; grid as grid" [grid]="grid" [detailRow]="row"></pbl-ngrid-row>`,
})
export class PblNgridDefaultDetailRowParentComponent { }
