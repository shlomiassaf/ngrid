import { Injectable, ElementRef } from '@angular/core';

import { PblDragDrop } from '../core/drag-drop';
import { PblDropListRef } from '../core/drop-list-ref';
import { PblColumnDropListRef } from './column-drop-list-ref';

/**
 * Service that allows for drag-and-drop functionality to be attached to DOM elements.
 */
@Injectable({providedIn: 'root'})
export class PblColumnDragDrop extends PblDragDrop {

  /**
   * Turns an element into a drop list.
   * @param element Element to which to attach the drop list functionality.
   */
  createDropList<T = any>(element: ElementRef<HTMLElement> | HTMLElement): PblDropListRef<T> {
    return new PblColumnDropListRef<T>(element, this._dragDropRegistry, this._document, this._ngZone, this._viewportRuler) as any;
  }
}
