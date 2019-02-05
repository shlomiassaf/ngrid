import { DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { NegDropListRef } from './drop-list-ref';

export class NegDragRef<T = any> extends DragRef<T> {
  constructor(...args: ConstructorParameters<typeof DragRef>) {
    super(...args);
    this.exited.subscribe( e => {
      const { container } = e;
      if (container instanceof NegDropListRef) {
        container.beforeExit.next({ item: this });
      }
    });
  }
}
