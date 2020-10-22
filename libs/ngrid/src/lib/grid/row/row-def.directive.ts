import { Directive, Inject, IterableDiffers, Optional, TemplateRef } from '@angular/core';
import { CdkRowDef, CDK_TABLE } from '@angular/cdk/table';
import { PblNgridRowContext } from '../context/types';
import { PblNgridRegistryService } from '../registry/registry.service';

@Directive({
  selector: '[pblNgridRowDef]',
  inputs: ['columns: pblNgridRowDefColumns', 'when: pblNgridRowDefWhen'],
  providers: [
    {provide: CdkRowDef, useExisting: PblNgridRowDef},
  ]
})
export class PblNgridRowDef<T> extends CdkRowDef<T> {

  columns: Iterable<string> = [];

  constructor(template: TemplateRef<PblNgridRowContext<T>>,
              _differs: IterableDiffers,
              protected registry: PblNgridRegistryService,
              @Inject(CDK_TABLE) @Optional() public _table?: any) {
    super(template, _differs, _table);
  }

  getColumnsDiff() {
    return null;
  }

  clone(): this {
    const clone = Object.create(this);
    this.columns = [];
    return clone;
  }
}
