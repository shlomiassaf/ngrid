// tslint:disable:use-input-property-decorator
import {
  Directive,
  TemplateRef,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { PblColumnTypeDefinitionDataMap } from '../../column/model';
import { PblNgridRegistryService } from '../../registry';
import { PblNgridCellDefDirectiveBase } from './types';

@Directive()
export abstract class PblNgridBaseCellDef<Z> implements OnInit, OnDestroy, PblNgridCellDefDirectiveBase {
  name: string;
  type: keyof PblColumnTypeDefinitionDataMap;

  constructor(public tRef: TemplateRef<Z>,
              protected registry: PblNgridRegistryService) { }

  abstract ngOnInit(): void;
  abstract ngOnDestroy(): void;
}
