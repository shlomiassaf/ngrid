import { Directive, Input } from '@angular/core';
import { PblNgridPluginController, NgridPlugin } from '@pebula/ngrid';
import { PblNgridOverlayPanelFactory, PblNgridOverlayPanel, PblNgridOverlayPanelConfig } from '@pebula/ngrid/overlay-panel';

declare module '@pebula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    matHeaderContextMenu?: PblNgridMatHeaderContextMenuPlugin;
  }
}

const PLUGIN_KEY: 'matHeaderContextMenu' = 'matHeaderContextMenu';

@NgridPlugin({ id: PLUGIN_KEY })
@Directive({ selector: 'pbl-ngrid[matHeaderContextMenu]', providers: [ PblNgridOverlayPanelFactory ] })
export class PblNgridMatHeaderContextMenuPlugin {

  @Input('matHeaderContextMenu') style: any;
  @Input() config: PblNgridOverlayPanelConfig;

  readonly overlayPanel: PblNgridOverlayPanel;

  constructor(overlayPanelFactory: PblNgridOverlayPanelFactory,
              public readonly pluginCtrl: PblNgridPluginController) {
    this.overlayPanel = overlayPanelFactory.create(pluginCtrl.extApi.grid);
  }

}
