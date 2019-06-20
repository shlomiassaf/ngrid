import { NgZone, ChangeDetectorRef, ElementRef, ViewContainerRef } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { DragRefConfig, DragDrop, CdkDropListGroup, CdkDropList, CdkDrag, DragDropRegistry } from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/scrolling';

export const isMaterial7 = CdkDropList.length === 7;

export function cdkDropList(element: ElementRef<HTMLElement>,
                            dragDrop: DragDrop,
                            changeDetectorRef: ChangeDetectorRef,
                            dir?: Directionality,
                            group?: CdkDropListGroup<CdkDropList>,
                            // for v7 compat
                            dragDropRegistry?: DragDropRegistry<any, any>,
                            document?: any,): ConstructorParameters<typeof CdkDropList> {
  return isMaterial7
    ? [ element, dragDropRegistry as any, changeDetectorRef, dir, group, document, dragDrop ] as any
    : [ element, dragDrop, changeDetectorRef, dir, group ]
  ;
}

export function cdkDrag(element: ElementRef<HTMLElement>,
                        dropContainer: CdkDropList,
                        _document: any,
                        _ngZone: NgZone,
                        _viewContainerRef: ViewContainerRef,
                        config: DragRefConfig,
                        _dir: Directionality,
                        dragDrop: DragDrop,
                        _changeDetectorRef: ChangeDetectorRef,
                        // for v7 compat
                        viewportRuler: ViewportRuler,
                        dragDropRegistry?: DragDropRegistry<any, any>,): ConstructorParameters<typeof CdkDrag> {
  return isMaterial7
    ? [ element, dropContainer, _document, _ngZone, _viewContainerRef, viewportRuler, dragDropRegistry, config, _dir, dragDrop ] as any
    : [ element, dropContainer, _document, _ngZone, _viewContainerRef, config, _dir, dragDrop, _changeDetectorRef ]
  ;
}
