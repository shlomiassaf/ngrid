import { Injectable, Inject, NgZone, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ViewportRuler} from '@angular/cdk/scrolling';
import { DragRef, DragRefConfig, DropListRef, DragDropRegistry } from '@angular/cdk/drag-drop';

import { PblDragRef } from './drag-ref'
import { PblDropListRef } from './drop-list-ref';

/** Default configuration to be used when creating a `DragRef`. */
const DEFAULT_CONFIG = {
  dragStartThreshold: 5,
  pointerDirectionChangeThreshold: 5
};

/**
 * Service that allows for drag-and-drop functionality to be attached to DOM elements.
 */
@Injectable({providedIn: 'root'})
export class PblDragDrop {
  constructor(@Inject(DOCUMENT) private _document: any,
              private _ngZone: NgZone,
              private _viewportRuler: ViewportRuler,
              private _dragDropRegistry: DragDropRegistry<DragRef, DropListRef>) {}

  /**
   * Turns an element into a draggable item.
   * @param element Element to which to attach the dragging functionality.
   * @param config Object used to configure the dragging behavior.
   */
  createDrag<T = any>(element: ElementRef<HTMLElement> | HTMLElement,
                      config: DragRefConfig = DEFAULT_CONFIG): PblDragRef<T> {
    return new PblDragRef<T>(element, config, this._document, this._ngZone, this._viewportRuler, this._dragDropRegistry);
  }

  /**
   * Turns an element into a drop list.
   * @param element Element to which to attach the drop list functionality.
   */
  createDropList<T = any>(element: ElementRef<HTMLElement> | HTMLElement): PblDropListRef<T> {
    return new PblDropListRef<T>(element, this._dragDropRegistry, this._document, this._ngZone, this._viewportRuler);
  }
}
