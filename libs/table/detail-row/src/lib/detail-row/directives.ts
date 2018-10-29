// tslint:disable:use-host-property-decorator
import {
  Component,
  Directive,
  IterableDiffers,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { CdkRowDef, RowContext } from '@angular/cdk/table';

import { NegTableComponent, NegTableRegistryService, NegTableSingleTemplateRegistryDirective } from '@neg/table';

declare module '@neg/table/lib/table/table-registry.service' {
  interface NegTableSingleRegistryMap {
    detailRowParent?: NegTableDetailRowParentRefDirective<any>;
    detailRow?: NegTableDetailRowDefDirective;
  }
}

export interface NegTableDetailRowContext<T> extends RowContext<T> {
  table: NegTableComponent<T>;
}

/**
 * Marks the element as the display element for the detail row itself.
 */
@Directive({ selector: '[negTableDetailRowDef]' })
export class NegTableDetailRowDefDirective extends NegTableSingleTemplateRegistryDirective<{ $implicit: any }, 'detailRow'> {
  readonly kind: 'detailRow' = 'detailRow';
  constructor(tRef: TemplateRef<{ $implicit: any }>, registry: NegTableRegistryService) { super(tRef, registry); }
}

@Directive({
  selector: '[negTableDetailRowParentRef]',
  inputs: ['columns: negTableDetailRowParentRef', 'when: negTableDetailRowParentRefWhen'],
})
export class NegTableDetailRowParentRefDirective<T> extends CdkRowDef<T> implements OnInit, OnDestroy {

  constructor(template: TemplateRef<NegTableDetailRowContext<T>>, _differs: IterableDiffers, protected registry: NegTableRegistryService) {
    super(template, _differs);
  }

  clone(): NegTableDetailRowParentRefDirective<T> {
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
  selector: 'neg-table-default-detail-row-parent',
  template: `<neg-table-row *negTableDetailRowParentRef="let row; table as table" [detailRow]="row" [table]="table"></neg-table-row>`,
})
export class NegTableDefaultDetailRowParentComponent { }
