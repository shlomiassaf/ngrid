import { take } from 'rxjs/operators';
import { Input, Directive, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { DragDrop, CdkDrag } from '@angular/cdk/drag-drop';

import { PblDragRef } from './drag-ref';
import { PblDragDrop } from './drag-drop';
import { CdkLazyDropList } from './drop-list';

@Directive({
  selector: '[cdkLazyDrag]',
  exportAs: 'cdkLazyDrag',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
  ],
})
export class CdkLazyDrag<T = any, Z extends CdkLazyDropList<T> = CdkLazyDropList<T>, DRef = any> extends CdkDrag<T> implements OnInit, AfterViewInit, OnDestroy {

  /**
   * A class to set when the root element is not the host element. (i.e. when `cdkDragRootElement` is used).
   */
  @Input('cdkDragRootElementClass') set rootElementSelectorClass(value: string) { // tslint:disable-line:no-input-rename
    if (value !== this._rootClass && this._hostNotRoot) {
      if (this._rootClass) {
        this.getRootElement().classList.remove(...this._rootClass.split(' '));
      }
      if (value) {
        this.getRootElement().classList.add(...value.split(' '));
      }
    }
    this._rootClass = value;
  }

  get pblDragRef(): PblDragRef<DRef> { return this._dragRef as any; }

  @Input() get cdkDropList(): Z { return this.dropContainer as Z; }
  set cdkDropList(value: Z) {
    // TO SUPPORT `cdkDropList` via string input (ID) we need a reactive registry...
    if (this.cdkDropList) {
      this.cdkDropList.removeDrag(this);
    }
    this.dropContainer = value;
    if (value) {
      this._dragRef._withDropContainer(value._dropListRef);
      value.addDrag(this);
    }
  }

  private _rootClass: string;
  private _hostNotRoot = false;

  ngOnInit(): void {
    if (this.pblDragRef instanceof PblDragRef === false) {
      throw new Error('Invalid `DragRef` injection, the ref is not an instance of PblDragRef')
    }
    this.pblDragRef.rootElementChanged.subscribe( event => {
      const rootElementSelectorClass = this._rootClass;
      const hostNotRoot = this.element.nativeElement !== event.curr;

      if (rootElementSelectorClass) {
        if (this._hostNotRoot) {
          event.prev.classList.remove(...rootElementSelectorClass.split(' '));
        }
        if (hostNotRoot) {
          event.curr.classList.add(...rootElementSelectorClass.split(' '));
        }
      }
      this._hostNotRoot = hostNotRoot;
    });
  }

  // This is a workaround for https://github.com/angular/material2/pull/14158
  // Working around the issue of drop container is not the direct parent (father) of a drag item.
  // The entire ngAfterViewInit() overriding method can be removed if PR accepted.
  ngAfterViewInit(): void {
    this.started.subscribe( startedEvent => {
      if (this.dropContainer) {
        const element = this.getRootElement();
        const initialRootElementParent = element.parentNode as HTMLElement;
        if (!element.nextSibling && initialRootElementParent !== this.dropContainer.element.nativeElement) {
          this.ended.pipe(take(1)).subscribe( endedEvent => initialRootElementParent.appendChild(element) );
        }
      }
    });
    super.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    if (this.cdkDropList) {
      this.cdkDropList.removeDrag(this);
    }
    super.ngOnDestroy();
  }
}
