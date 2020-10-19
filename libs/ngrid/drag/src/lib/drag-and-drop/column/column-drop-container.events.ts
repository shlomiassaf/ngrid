import { CdkDragEnter, CdkDragDrop, CdkDragExit } from '@angular/cdk/drag-drop';
import { PblNgridColumnDragDirective } from './column-drag';
import { PblNgridColumnDragContainerDirective } from './column-drag-container';
import { PblNgridColumnDropContainerDirective } from './column-drop-container';

export interface PblColumnDragDropContainerEnter<T = any> extends Omit<CdkDragEnter<T>, 'container' | 'item'> {
  /** Container into which the user has moved the item. */
  container: PblNgridColumnDropContainerDirective<T>;
  /** Item that was moved into the container. */
  item: PblNgridColumnDragDirective<T>;
}
export interface PblColumnDragDropContainerDrop<T = any> extends Omit<CdkDragDrop<T>, 'previousContainer' | 'container' | 'item'> {
  /** Item that is being dropped. */
  item: PblNgridColumnDragDirective<T>;
  /** Container in which the item was dropped. */
  container: PblNgridColumnDropContainerDirective<T>;
  /** Container from which the item was picked up. Can be the same as the `container`. */
  previousContainer: PblNgridColumnDropContainerDirective<T> | PblNgridColumnDragContainerDirective<T>;
}

export interface PblColumnDragDropContainerExit<T = any> extends Omit<CdkDragExit<T>, 'container' | 'item'> {
  /** Item that is being dropped. */
  item: PblNgridColumnDragDirective<T>;
  /** Container in which the item was dropped. */
  container: PblNgridColumnDropContainerDirective<T>;
}
