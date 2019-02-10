import { Subject } from 'rxjs';
import { ElementRef } from '@angular/core';
import { DropListRef } from '@angular/cdk/drag-drop';
import { coerceElement } from '@angular/cdk/coercion';

import { PblDragRef } from './drag-ref';

export class PblDropListRef<T = any> extends DropListRef<T> {
  /** Emits right before dragging has started. */
  beforeExit = new Subject<{ item: PblDragRef<T> }>();

  withElement(element: ElementRef<HTMLElement> | HTMLElement): this {
    // TODO: Workaround, see if we can push this through https://github.com/angular/material2/issues/15086
    (this as { -readonly [P in keyof PblDropListRef]: PblDropListRef[P] }).element = coerceElement(element);
    return this;
  }

  dispose(): void {
    this.beforeExit.complete();
    super.dispose();
  }
}
