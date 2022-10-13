import { ComponentRef, Type } from '@angular/core';
import { PblNgridMultiComponentRegistry, PblNgridDataHeaderExtensionContext } from '@pebula/ngrid';
import { PblNgridBsSortablePlugin } from './bs-sortable-plugin';
import { PblNgridBsSortable } from './bs-sortable/bs-sortable.component';

export class PblBsSortableExtension extends PblNgridMultiComponentRegistry<PblNgridBsSortable, 'dataHeaderExtensions'> {
  readonly name: 'bsSortContainer' = 'bsSortContainer';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  readonly componentType: Type<unknown> = PblNgridBsSortable;
  readonly projectContent = true;

  shouldRender(context: PblNgridDataHeaderExtensionContext): boolean {
    return !!context.col.sort && !!context.injector.get<PblNgridBsSortablePlugin>(PblNgridBsSortablePlugin, false as any);
  }


  onCreated(context: PblNgridDataHeaderExtensionContext, cmpRef: ComponentRef<PblNgridBsSortable>): void {
    // We assign the ID and also verify that it does not exist on the `MatSort` container
    // It might exists on specific scenarios when a header is removed and added instantly but the "add" part happens before the teardown so the `MatSort` will throw.
    this.deregisterId(context, cmpRef.instance.id = context.col.id);
    cmpRef.changeDetectorRef.markForCheck();
  }

  /**
   * Check that the current `MatSort` does not already have a sortable header with the provided id.
   */
  private deregisterId(context: PblNgridDataHeaderExtensionContext, id: any) {
    const matSort = context.injector.get(PblNgridBsSortablePlugin);
    const matSortHeader = matSort.sortables.get(id)
    if (matSortHeader) {
      matSort.deregister(matSortHeader);
    }
  }
}
