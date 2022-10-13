
import { ComponentRef, Type, Injector } from '@angular/core';
import { PblNgridMultiComponentRegistry } from '@pebula/ngrid';

export class PblNgridOverlayPanelComponentExtension<T> extends PblNgridMultiComponentRegistry<T, 'overlayPanels'> {
  readonly name: string;
  readonly kind: 'overlayPanels' = 'overlayPanels';
  readonly componentType: Type<unknown>;
  readonly projectContent = false;

  constructor(name: string, component: Type<T>, public injector?: Injector) {
    super();
    this.componentType = component;
    this.name = name;
  }

  onCreated(context: any, cmpRef: ComponentRef<T>): void {
    cmpRef.changeDetectorRef.markForCheck();
    cmpRef.changeDetectorRef.detectChanges();
  }
}
