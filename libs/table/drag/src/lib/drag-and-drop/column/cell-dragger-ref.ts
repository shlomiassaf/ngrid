import { Directive, TemplateRef } from '@angular/core';
import { PblTableRegistryService, PblTableMultiTemplateRegistry, PblTableDataHeaderExtensionRef, PblTableDataHeaderExtensionContext, PblTablePluginController } from '@pebula/table';

import { PLUGIN_KEY } from './column-reorder-plugin';

/**
 * Marks the element as the resizer template for cells.
 */
@Directive({ selector: '[negTableCellDraggerRef]' })
export class PblTableCellDraggerRefDirective extends PblTableMultiTemplateRegistry<PblTableDataHeaderExtensionContext, 'dataHeaderExtensions'> implements PblTableDataHeaderExtensionRef {
  readonly name: 'cellDragger' = 'cellDragger';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  constructor(tRef: TemplateRef<PblTableDataHeaderExtensionContext>, registry: PblTableRegistryService) { super(tRef, registry); }

  shouldRender(context: PblTableDataHeaderExtensionContext): boolean {
    // We dont check for `context.col.reorder` because even if a specific column does not "reorder" we still need to render the cdk-drag
    // so the cdk-drop-list will be aware of this item, so if another item does reorder it will be able to move while taking this element into consideration.
    // I.E: It doesn't reorder but it's part of the playground.
    //
    // However, when the plugin does not exists for this table we don't need to render...

    const pluginCtrl = PblTablePluginController.find(context.table);
    return pluginCtrl.hasPlugin(PLUGIN_KEY);
  }
}
