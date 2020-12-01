import { EmbeddedViewRef } from '@angular/core';
import { _ViewRepeaterItemInsertArgs } from '@angular/cdk/collections';
import { PblRowContext } from '../context/row';
import { PblNgridRowComponent } from './row.component';

let currentItemArgs: _ViewRepeaterItemInsertArgs<PblRowContext<any>>;
let currentRow: PblNgridRowComponent;

class RowToRepeaterBridge {

  bridgeRow(row: PblNgridRowComponent): Omit<_ViewRepeaterItemInsertArgs<PblRowContext<any>>, 'templateRef'> {
    const itemArgs = currentItemArgs;
    currentItemArgs = undefined;
    currentRow = row;
    return itemArgs;
  }

  bridgeContext<C extends PblRowContext<any>>(itemArgs: _ViewRepeaterItemInsertArgs<PblRowContext<any>>, createView: () => EmbeddedViewRef<C>): EmbeddedViewRef<C> {
    currentRow = undefined;
    currentItemArgs = itemArgs;
    const view = createView();
    if (view.rootNodes[0] !== currentRow.element) {
      throw new Error('');
    }
    currentRow = currentItemArgs = undefined;
    return view;
  }
}

export const rowContextBridge = new RowToRepeaterBridge();
