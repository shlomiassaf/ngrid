
import { ComponentRef, Type, ComponentFactoryResolver, ComponentFactory, Injector } from '@angular/core';
import { PblNgridMultiComponentRegistry } from '@pebula/ngrid';

export class PblNgridOverlayPanelComponentExtension<T> extends PblNgridMultiComponentRegistry<T, 'overlayPanels'> {
  readonly name: string;
  readonly kind: 'overlayPanels' = 'overlayPanels';
  readonly projectContent = false;

  constructor(name: string,
              public component: Type<T>,
              public cfr?: ComponentFactoryResolver,
              public injector?: Injector) {
    super();
    this.name = name;
  }

  getFactory(context: any): ComponentFactory<T> {
    return this.cfr.resolveComponentFactory(this.component);
  }

  onCreated(context: any, cmpRef: ComponentRef<T>): void {
    cmpRef.changeDetectorRef.markForCheck();
    cmpRef.changeDetectorRef.detectChanges();
  }
}
