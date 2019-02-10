import { ComponentFactory, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';

import { PblTableMultiComponentRegistry, PblTableDataHeaderExtensionContext } from '@pebula/table';

export class MatSortExtension extends PblTableMultiComponentRegistry<MatSortHeader, 'dataHeaderExtensions'> {
  readonly name: 'sortContainer' = 'sortContainer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  readonly projectContent = true;

  constructor(private cfr: ComponentFactoryResolver) {
    super();
  }

  shouldRender(context: PblTableDataHeaderExtensionContext): boolean {
    return !!context.col.sort && !!context.injector.get(MatSort, false);
  }

  getFactory(context: PblTableDataHeaderExtensionContext): ComponentFactory<MatSortHeader> {
    return this.cfr.resolveComponentFactory(MatSortHeader);
  }

  onCreated(context: PblTableDataHeaderExtensionContext, cmpRef: ComponentRef<MatSortHeader>): void {
    // We assign the ID and also verify that it does not exist on the `MatSort` container
    // It might exists on specific scenarios when a header is removed and added instantly but the "add" part happens before the teardown so the `MatSort` will throw.
    this.deregisterId(context, cmpRef.instance.id = context.col.id);
    cmpRef.changeDetectorRef.markForCheck();
  }

  /**
   * Check that the current `MatSort` does not already have a sortable header with the provided id.
   */
  private deregisterId(context: PblTableDataHeaderExtensionContext, id: any) {
    const matSort = context.injector.get<MatSort>(MatSort);
    const matSortHeader = matSort.sortables.get(id)
    if (matSortHeader) {
      matSort.deregister(matSortHeader);
    }
  }
}
