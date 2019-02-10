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

import { PblTableRegistryService, PblTableSingleTemplateRegistry, PblTableRowContext } from '@pebula/table';

declare module '@pebula/table/lib/table/services/table-registry.service' {
  interface PblTableSingleRegistryMap {
    detailRowParent?: PblTableDetailRowParentRefDirective<any>;
    detailRow?: PblTableDetailRowDefDirective;
  }
}

/**
 * Marks the element as the display element for the detail row itself.
 */
@Directive({ selector: '[negTableDetailRowDef]' })
export class PblTableDetailRowDefDirective extends PblTableSingleTemplateRegistry<PblTableRowContext<any>, 'detailRow'> {
  readonly kind: 'detailRow' = 'detailRow';
  constructor(tRef: TemplateRef<PblTableRowContext<any>>, registry: PblTableRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[negTableDetailRowParentRef]',
  inputs: ['columns: negTableDetailRowParentRef', 'when: negTableDetailRowParentRefWhen'],
})
export class PblTableDetailRowParentRefDirective<T> extends CdkRowDef<T> implements OnInit, OnDestroy {

  constructor(template: TemplateRef<PblTableRowContext<T>>, _differs: IterableDiffers, protected registry: PblTableRegistryService) {
    super(template, _differs);
  }

  clone(): PblTableDetailRowParentRefDirective<T> {
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
 * Use to set the a default `negTableDetailRowParentRef` if the user did not set one.
 * @internal
 */
@Component({
  selector: 'pbl-table-default-detail-row-parent',
  template: `<pbl-table-row *pblTableDetailRowParentRef="let row; table as table" [detailRow]="row"></pbl-table-row>`,
})
export class PblTableDefaultDetailRowParentComponent { }
