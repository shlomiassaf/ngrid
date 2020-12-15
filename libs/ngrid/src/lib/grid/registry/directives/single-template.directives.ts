import { Directive, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { PblNgridRegistryService, PblNgridSingleRegistryMap } from '@pebula/ngrid/core';

@Directive()
export abstract class PblNgridSingleTemplateRegistry<T, TKind extends keyof PblNgridSingleRegistryMap> implements OnInit, OnDestroy {
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: PblNgridRegistryService) { }

  ngOnInit(): void {
    this.registry.setSingle(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle(this.kind,  undefined);
  }
}
