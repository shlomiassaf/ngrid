import { ComponentRef, Type } from '@angular/core';
import { PblNgridMultiComponentRegistry, PblNgridDataHeaderExtensionContext } from '@pebula/ngrid';

import { PblNgridMatHeaderContextMenuPlugin } from './header-context-menu.directive';
import { MatHeaderContextMenuTrigger } from './header-context-menu-trigger';

export class MatHeaderContextMenuExtension extends PblNgridMultiComponentRegistry<MatHeaderContextMenuTrigger, 'dataHeaderExtensions'> {
  readonly name: 'matHeaderContextMenuTrigger' = 'matHeaderContextMenuTrigger';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  readonly componentType: Type<unknown> = MatHeaderContextMenuTrigger;

  readonly projectContent = false;

  shouldRender(context: PblNgridDataHeaderExtensionContext): boolean {
    return !!context.injector.get(PblNgridMatHeaderContextMenuPlugin, false);
  }

  onCreated(context: PblNgridDataHeaderExtensionContext, cmpRef: ComponentRef<MatHeaderContextMenuTrigger>): void {
    cmpRef.instance.context = context;
    cmpRef.changeDetectorRef.markForCheck();
  }
}
