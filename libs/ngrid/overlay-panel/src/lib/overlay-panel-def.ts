import { Directive, TemplateRef, Input } from '@angular/core';
import { PblNgridComponent, PblNgridRegistryService, PblNgridMultiTemplateRegistry } from '@pebula/ngrid';
import { PblNgridOverlayPanelRef } from './overlay-panel-ref';

export interface PblNgridOverlayPanelContext<T = any> {
  grid: PblNgridComponent<T>;
  ref: PblNgridOverlayPanelRef;
}

@Directive({ selector: '[pblNgridOverlayPanelDef]' })
export class PblNgridOverlayPanelDef extends PblNgridMultiTemplateRegistry<PblNgridComponent, 'overlayPanels'> {

  readonly kind: 'overlayPanels' = 'overlayPanels';
  @Input('pblNgridOverlayPanelDef') name: string;

  constructor(tRef: TemplateRef<PblNgridComponent>, registry: PblNgridRegistryService) { super(tRef, registry); }
}
