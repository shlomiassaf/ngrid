import { ComponentRef, Type } from '@angular/core';
import { MatSort, MatSortHeader } from '@angular/material/sort';

import { PblNgridMultiComponentRegistry, PblNgridDataHeaderExtensionContext } from '@pebula/ngrid';

export class MatSortExtension extends PblNgridMultiComponentRegistry<MatSortHeader, 'dataHeaderExtensions'> {
  readonly name: 'sortContainer' = 'sortContainer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  readonly componentType: Type<unknown> = MatSortHeader;
  readonly projectContent = true;

  constructor() {
    super();
  }

  shouldRender(context: PblNgridDataHeaderExtensionContext): boolean {
    return !!context.col.sort && !!context.injector.get<MatSort>(MatSort, false as any);
  }

  onCreated(context: PblNgridDataHeaderExtensionContext, cmpRef: ComponentRef<MatSortHeader>): void {
    // We assign the ID and also verify that it does not exist on the `MatSort` container
    // It might exists on specific scenarios when a header is removed and added instantly but the "add" part happens before the teardown so the `MatSort` will throw.
    this.deregisterId(context, cmpRef.instance.id = context.col.id);
    cmpRef.changeDetectorRef.markForCheck();
  }

  /**
   * Check that the current `MatSort` does not already have a sortable header with the provided id.
   */
  private deregisterId(context: PblNgridDataHeaderExtensionContext, id: any) {
    const matSort = context.injector.get<MatSort>(MatSort);
    const matSortHeader = matSort.sortables.get(id)
    if (matSortHeader) {
      matSort.deregister(matSortHeader);
    }
  }
}
