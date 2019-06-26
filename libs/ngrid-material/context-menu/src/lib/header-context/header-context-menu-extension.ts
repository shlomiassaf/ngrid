import { ComponentFactory, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { PblNgridMultiComponentRegistry, PblNgridDataHeaderExtensionContext } from '@pebula/ngrid';

import { PblNgridMatHeaderContextMenuPlugin } from './header-context-menu.directive';
import { MatHeaderContextMenuTrigger } from './header-context-menu-trigger';

export class MatHeaderContextMenuExtension extends PblNgridMultiComponentRegistry<MatHeaderContextMenuTrigger, 'dataHeaderExtensions'> {
  readonly name: 'matHeaderContextMenuTrigger' = 'matHeaderContextMenuTrigger';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  readonly projectContent = false;

  constructor(private cfr: ComponentFactoryResolver) { super(); }

  shouldRender(context: PblNgridDataHeaderExtensionContext): boolean {
    return !!context.injector.get(PblNgridMatHeaderContextMenuPlugin, false);
  }

  getFactory(context: PblNgridDataHeaderExtensionContext): ComponentFactory<MatHeaderContextMenuTrigger> {
    return this.cfr.resolveComponentFactory(MatHeaderContextMenuTrigger);
  }

  onCreated(context: PblNgridDataHeaderExtensionContext, cmpRef: ComponentRef<MatHeaderContextMenuTrigger>): void {
    cmpRef.instance.context = context;
    cmpRef.changeDetectorRef.markForCheck();
  }
}
