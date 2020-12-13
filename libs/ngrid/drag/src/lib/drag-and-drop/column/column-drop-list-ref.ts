import { PblDropListRef } from '../core/drop-list-ref';
import { PblDragRef } from '../core/drag-ref';
import { PblNgridColumnReorderPluginDirective } from './column-reorder-plugin';
import { PblNgridColumnDragDirective } from './column-drag';

export class PblColumnDropListRef<T = any> extends PblDropListRef<PblNgridColumnReorderPluginDirective<T>> {

  private lastSwap: PblDragRef<PblNgridColumnDragDirective<T>>;

  _sortPredicate(newIndex: number, drag: PblDragRef<PblNgridColumnDragDirective<T>>, drop: PblColumnDropListRef<T>) {
    const siblings: PblDragRef<PblNgridColumnDragDirective<T>>[] = this.data.getSortedItems().map( c => c._dragRef) as any;

    const dragAtNewPosition = siblings[newIndex];
    if (dragAtNewPosition.data.column.wontBudge) {
      return false;
    }

    // we now need to find if between current and new position there are items with `wontBudge`
    const itemAtOriginalPosition = this.lastSwap ? this.lastSwap : drag;
    const currentIndex = siblings.findIndex( currentItem => currentItem === itemAtOriginalPosition );
    const start = Math.min(newIndex, currentIndex)
    const itemsDraggedOver = siblings.slice(start, Math.abs(newIndex - currentIndex) + start);
    for (const dragItem of itemsDraggedOver) {
      if (dragItem.data.column.wontBudge && dragItem !== drag) {
        return false;
      }
    }

    if (!drag.data.column.checkGroupLockConstraint(dragAtNewPosition.data.column)) {
      return false;
    }

    this.lastSwap = dragAtNewPosition;
    return true;
  }

  _sortItem(item: PblDragRef, pointerX: number, pointerY: number, pointerDelta: {x: number, y: number}) {
    const lastSwap = this.lastSwap;
    this.sortPredicate = (index, drag) => this._sortPredicate(index, drag as any, this);
    super._sortItem(item, pointerX, pointerY, pointerDelta);

    if (this.lastSwap && this.lastSwap !== lastSwap && this.data.orientation === 'horizontal') {
      const siblings: PblDragRef<PblNgridColumnDragDirective<T>>[] = this.data.getSortedItems().map( c => c._dragRef) as any;
      siblings.forEach((sibling, index) => {
        // Don't do anything if the position hasn't changed.
        // if (oldOrder[index] === sibling) {
        //   return;
        // }
        const transform = sibling.getVisibleElement().style.transform
        for (const c of sibling.data.getCells()) {
          c.style.transform = transform;
        }
      });
    }
  }
}

export function patchDropListRef<T = any>(dropListRef: PblDropListRef<PblNgridColumnReorderPluginDirective<T>>) {
  try {
    Object.setPrototypeOf(dropListRef, PblColumnDropListRef.prototype);
  } catch (err) {
    (dropListRef as any)._sortPredicate = PblColumnDropListRef.prototype._sortPredicate;
    dropListRef._sortItem = PblColumnDropListRef.prototype._sortItem;
  }
}
