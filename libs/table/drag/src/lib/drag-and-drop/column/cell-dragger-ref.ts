import { Directive, TemplateRef } from '@angular/core';
import { NegTableRegistryService, NegTableMultiTemplateRegistry, NegTableDataHeaderExtensionRef, NegTableDataHeaderExtensionContext, NegTablePluginController } from '@pebula/table';

import { PLUGIN_KEY } from './column-reorder-plugin';

/**
 * Marks the element as the resizer template for cells.
 */
@Directive({ selector: '[negTableCellDraggerRef]' })
export class NegTableCellDraggerRefDirective extends NegTableMultiTemplateRegistry<NegTableDataHeaderExtensionContext, 'dataHeaderExtensions'> implements NegTableDataHeaderExtensionRef {
  readonly name: 'cellDragger' = 'cellDragger';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  constructor(tRef: TemplateRef<NegTableDataHeaderExtensionContext>, registry: NegTableRegistryService) { super(tRef, registry); }

  shouldRender(context: NegTableDataHeaderExtensionContext): boolean {
    // We dont check for `context.col.reorder` because even if a specific column does not "reorder" we still need to render the cdk-drag
    // so the cdk-drop-list will be aware of this item, so if another item does reorder it will be able to move while taking this element into consideration.
    // I.E: It doesn't reorder but it's part of the playground.
    //
    // However, when the plugin does not exists for this table we don't need to render...

    const pluginCtrl = NegTablePluginController.find(context.table);
    return pluginCtrl.hasPlugin(PLUGIN_KEY);
  }
}
