import { Directive, TemplateRef } from '@angular/core';
import { NegTableRegistryService, NegTableMultiTemplateRegistry, NegTableDataHeaderExtensionRef, NegTableDataHeaderExtensionContext } from '@neg/table';

/**
 * Marks the element as the resizer template for cells.
 */
@Directive({ selector: '[negTableCellDraggerRef]' })
export class NegTableCellDraggerRefDirective extends NegTableMultiTemplateRegistry<NegTableDataHeaderExtensionContext, 'dataHeaderExtensions'> implements NegTableDataHeaderExtensionRef {
  readonly name: 'cellDragger' = 'cellDragger';
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';
  constructor(tRef: TemplateRef<NegTableDataHeaderExtensionContext>, registry: NegTableRegistryService) { super(tRef, registry); }

  shouldRender(context: NegTableDataHeaderExtensionContext): boolean {
    // const col = context.col as NegColumn;
    // return !!col.reorder;

    // We must return true so all drag element are created
    // this is because, even if a column can not reorder by itself it will still move if other items around it are reordered.
    // For this to happen properly we need the drop-list to be aware of this column (that can not reorder), if we won't render the drag item the drop-list will not know about this column.
    return true;

  }
}
