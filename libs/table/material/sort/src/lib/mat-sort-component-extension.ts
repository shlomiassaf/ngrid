import { ComponentFactory, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { MatSortHeader } from '@angular/material/sort';

import { NegTableMultiComponentRegistry, NegTableDataHeaderExtensionContext } from '@neg/table';

export class MatSortExtension extends NegTableMultiComponentRegistry<MatSortHeader, 'dataHeaderExtensions'> {
  readonly name: 'sortContainer' = 'sortContainer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  readonly projectContent = true;

  constructor(private cfr: ComponentFactoryResolver) {
    super();
  }

  shouldRender(context: NegTableDataHeaderExtensionContext): boolean {
    return !!context.col.sort;
  }

  getFactory(context: NegTableDataHeaderExtensionContext): ComponentFactory<MatSortHeader> {
    return this.cfr.resolveComponentFactory(MatSortHeader);
  }

  onCreated(context: NegTableDataHeaderExtensionContext, cmpRef: ComponentRef<MatSortHeader>): void {
    cmpRef.instance.id = context.col.id;
    cmpRef.changeDetectorRef.markForCheck();
  }
}
