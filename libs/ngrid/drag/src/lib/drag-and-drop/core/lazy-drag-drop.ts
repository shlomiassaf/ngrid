import { take } from 'rxjs/operators';
import { Input, Directive, ElementRef, QueryList, OnDestroy, Optional, AfterViewInit, OnInit } from '@angular/core';
import { CdkDropList, CdkDrag, CdkDragHandle, CDK_DROP_LIST, DragDrop } from '@angular/cdk/drag-drop';
import { PblDropListRef } from './drop-list-ref';
import { PblDragRef } from './drag-ref';
import { PblDragDrop } from './drag-drop';

@Directive({
  selector: '[cdkLazyDropList]',
  exportAs: 'cdkLazyDropList',
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DROP_LIST, useClass: CdkLazyDropList },
  ],
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
  }
})
export class CdkLazyDropList<T = any, DRef = any> extends CdkDropList<T> implements OnInit {
  get pblDropListRef(): PblDropListRef<DRef> { return this._dropListRef as any; }

  /**
   * Selector that will be used to determine the direct container element, starting from
   * the `cdkDropList` element and going down the DOM. Passing an alternate direct container element
   * is useful when the `cdkDropList` is not the direct parent (i.e. ancestor but not father)
   * of the draggable elements.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('cdkDropListDirectContainerElement') directContainerElement: string;

  _draggables: QueryList<CdkDrag>;

  /* private */ originalElement: ElementRef<HTMLElement>;
  /* private */ _draggablesSet = new Set<CdkDrag>();

  ngOnInit(): void {
    if (this.pblDropListRef instanceof PblDropListRef === false) {
      throw new Error('Invalid `DropListRef` injection, the ref is not an instance of PblDropListRef')
    }
    this._dropListRef.beforeStarted.subscribe( () => this.beforeStarted() );
  }

  addDrag(drag: CdkDrag): void {
    this._draggablesSet.add(drag);
    this._draggables.reset(Array.from(this._draggablesSet.values()));
    this._draggables.notifyOnChanges(); // TODO: notify with asap schedular and obs$
  }

  removeDrag(drag: CdkDrag): boolean {
    const result = this._draggablesSet.delete(drag);
    if (result) {
      this._draggables.reset(Array.from(this._draggablesSet.values()));
      this._draggables.notifyOnChanges(); // TODO: notify with asap schedular and obs$
    }
    return result;
  }

  /* protected */ beforeStarted(): void {
    // This is a workaround for https://github.com/angular/material2/pull/14153
    // Working around the missing capability for selecting a container element that is not the drop container host.
    if (!this.originalElement) {
      this.originalElement = this.element;
    }
    if (this.directContainerElement) {
      const element = this.originalElement.nativeElement.querySelector(this.directContainerElement) as HTMLElement;
      this.element = new ElementRef<HTMLElement>(element);
    } else {
      this.element = this.originalElement;
    }
    this.pblDropListRef.withElement(this.element);
  }
}

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

  /* private */ _rootClass: string;
  /* private */ _hostNotRoot = false;

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

    /* super.ngAfterViewInit(); */
  }

  ngOnDestroy(): void {
    if (this.cdkDropList) {
      this.cdkDropList.removeDrag(this);
    }
    /* super.ngOnDestroy(); */
  }
}

/** Handle that can be used to drag and CdkDrag instance. */
@Directive({
  selector: '[pblDragHandle]',
  host: { // tslint:disable-line:use-host-property-decorator
    'class': 'cdk-drag-handle'
  },
  providers: [
    {
      provide: CdkDragHandle,
      useExisting: PblDragHandle
    }
  ]
})
export class PblDragHandle extends CdkDragHandle {
  constructor(public element: ElementRef<HTMLElement>, @Optional() parentDrag?: CdkDrag) { super(element, parentDrag); }
}
