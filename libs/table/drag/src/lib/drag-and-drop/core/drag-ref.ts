import { ElementRef, EventEmitter } from '@angular/core';
import { coerceElement } from '@angular/cdk/coercion';
import { DragRef } from '@angular/cdk/drag-drop';

import { NegDropListRef } from './drop-list-ref';

export class NegDragRef<T = any> extends DragRef<T> {

  /**
   * Fires when the root element changes
   *
   * > Does not emit on the initial setup.
   */
  rootElementChanged = new EventEmitter<{
    prev: HTMLElement;
    curr: HTMLElement;
  }>();

  constructor(...args: ConstructorParameters<typeof DragRef>) {
    super(...args);
    this.exited.subscribe( e => {
      const { container } = e;
      if (container instanceof NegDropListRef) {
        container.beforeExit.next({ item: this });
      }
    });
  }

  /**
   * Sets an alternate drag root element. The root element is the element that will be moved as
   * the user is dragging. Passing an alternate root element is useful when trying to enable
   * dragging on an element that you might not have access to.
   */
  withRootElement(rootElement: ElementRef<HTMLElement> | HTMLElement): this {
    // the first call to `withRootElement` comes from the base class, before we construct the emitter.
    // We don't need it anyway...
    if (this.rootElementChanged) {
      const element = coerceElement(rootElement);
      if (this.getRootElement() !== element) {
        this.rootElementChanged.next({ prev: this.getRootElement(), curr: element })
      }
    }
    return super.withRootElement(rootElement);
  }

  dispose(): void {
    this.rootElementChanged.complete();
    super.dispose();
  }
}
