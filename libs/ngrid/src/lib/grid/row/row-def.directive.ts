import { Directive, Inject, IterableDiffers, Optional, TemplateRef, OnInit } from '@angular/core';
import { CdkRowDef, CDK_TABLE } from '@angular/cdk/table';
import { PblNgridRowContext } from '../context/types';
import { PblNgridRegistryService } from '../registry/registry.service';
import { PblNgridComponent } from '../ngrid.component';
import { PblNgridPluginController } from '../../ext/plugin-control';
import { EXT_API_TOKEN, PblNgridExtensionApi } from '../../ext/grid-ext-api';

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

/**
 * A directive for quick replacements of the row container component.
 *
 * When used inside the content of the grid:
 *
 * ```html
 * <pbl-ngrid [dataSource]="ds" [columns]="columns">
 *   <pbl-ngrid-row *pblNgridRowOverride="let row;" row></pbl-ngrid-row>
 * </pbl-ngrid>
 * ```
 *
 * However, when used outside of the grid you must provide a reference to the grid so it can register as a template:
 *
 * ```html
 * <pbl-ngrid-row *pblNgridRowOverride="let row; grid: myGrid" row></pbl-ngrid-row>
 * <pbl-ngrid #myGrid [dataSource]="ds" [columns]="columns"></pbl-ngrid>
 * ```
 */
@Directive({
  selector: '[pblNgridRowOverride]',
  inputs: ['columns: pblNgridRowDefColumns', 'when: pblNgridRowDefWhen', 'grid: pblNgridRowDefGrid'],
  providers: [
    {provide: CdkRowDef, useExisting: PblNgridRowDef},
  ]
})
export class PblNgridRowOverride<T> extends PblNgridRowDef<T> implements OnInit {

  grid: PblNgridComponent<T>;

  constructor(template: TemplateRef<PblNgridRowContext<T>>,
              _differs: IterableDiffers,
              registry: PblNgridRegistryService,
              @Inject(EXT_API_TOKEN) @Optional() private extApi?: PblNgridExtensionApi<T>) {
    super(template, _differs, registry, extApi?.cdkTable);
    this.when = () => true;
  }

  ngOnInit() {
    if (!this.extApi && this.grid) {
      this.extApi = PblNgridPluginController.find(this.grid).extApi;
    }
    if (this.extApi) {
      this.extApi.cdkTable.addRowDef(this);
    }
  }
}
