// tslint:disable:use-host-property-decorator
import {
  Component,
  Directive,
  IterableDiffers,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { CdkRowDef } from '@angular/cdk/table';

import { PblNgridRegistryService, PblNgridSingleTemplateRegistry, PblNgridRowContext } from '@pebula/ngrid';

declare module '@pebula/ngrid/lib/table/services/table-registry.service' {
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
export class PblNgridDetailRowParentRefDirective<T> extends CdkRowDef<T> implements OnInit, OnDestroy {

  constructor(template: TemplateRef<PblNgridRowContext<T>>, _differs: IterableDiffers, protected registry: PblNgridRegistryService) {
    super(template, _differs);
  }

  clone(): PblNgridDetailRowParentRefDirective<T> {
    const clone = Object.create(this);
    this._columnsDiffer = this.columns = undefined;
    return clone;
  }

  ngOnInit(): void {
    this.registry.setSingle('detailRowParent', this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle('detailRowParent',  undefined);
  }
}

/**
 * Use to set the a default `pblNgridDetailRowParentRef` if the user did not set one.
 * @internal
 */
@Component({
  selector: 'pbl-ngrid-default-detail-row-parent',
  template: `<pbl-ngrid-row *pblNgridDetailRowParentRef="let row; table as table" [detailRow]="row"></pbl-ngrid-row>`,
})
export class PblNgridDefaultDetailRowParentComponent { }
