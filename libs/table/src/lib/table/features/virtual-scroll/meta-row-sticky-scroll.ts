
import { ViewContainerRef } from '@angular/core';
import { NegCdkVirtualScrollViewportComponent } from './virtual-scroll-viewport.component';
import { updateStickyRows } from './utils';

/**
 * A class that manages the life cycle of sticky meta rows (header & footer) while scrolling.
 * Sticky meta rows are moved to containers outside of the table so they do not depend on the `position: sticky` property.
 *
 * For `position: sticky` to work, a reference position is required (`top` for header, `bottom` for footer) which must reflect the current
 * offset measured by the virtual scroll viewport (this position compensate the offset of virtual scroll so the position is leveled, i.e. like top 0)
 *
 * When the user scroll's:
 * - The offset changes by the browser
 * - The virtual scroll will detect the new offset and update the wrapper with the new offset.
 *
 * There is a time gap between the operations above which causes rows to flicker in and out of view, this is why we move them to a fixed location.
 */
export class MetaRowStickyScroll {

  private runningHeader = false;
  private runningFooter = false;
  private canMoveHeader = true;
  private canMoveFooter = true;
  private movedFooterRows: Array<[HTMLElement, HTMLElement, number]> = [];
  private movedHeaderRows: Array<[HTMLElement, HTMLElement, number]> = [];

  constructor(private viewport: NegCdkVirtualScrollViewportComponent,
              private viewPortEl: HTMLElement,
              private metaRows: Record<'header' | 'footer', { rows: HTMLElement[]; sticky: boolean[]; rendered: boolean[] }>) { }

  canMove(): boolean {
    return this.canMoveHeader || this.canMoveFooter;
  }

  isRunning(): boolean {
    return this.runningHeader || this.runningFooter;
  }

  move(offset: number, viewPortElRect: ClientRect | DOMRect): boolean {
    this.moveHeader(offset, viewPortElRect);
    this.moveFooter(offset, viewPortElRect);
    return this.isRunning() && !this.canMoveHeader && !this.canMoveFooter;
  }


  restore(renderedContentOffset: number): void {
    const { header, footer } = this.metaRows;
    if (this.restoreHeader()) {
      updateStickyRows(renderedContentOffset, header.rows, header.sticky, 'top');
    }
    if (this.restoreFooter()) {
      updateStickyRows(renderedContentOffset, footer.rows, footer.sticky, 'bottom');
    }
  }

  private moveHeader(offset: number, viewPortElRect: ClientRect | DOMRect): void {
    if (!this.runningHeader || this.canMoveHeader) {
      this.runningHeader = true;
      this.canMoveHeader = false;

      const stickyAndRendered: number[] = [];
      const headerRows = this.metaRows.header;
      let mostTopRect: ClientRect | DOMRect;
      for (let i = 0, len = headerRows.rows.length; i < len; i++) {
        const rowEl = headerRows.rows[i];
        if (headerRows.sticky[i]) {
          const elRect = rowEl.getBoundingClientRect();
          if (headerRows.rendered[i]) {
            const calc = elRect.top - viewPortElRect.top - offset;

            // if after the scroll the element is still in view, return
            if (calc >= 0 || -calc < viewPortElRect.height) {
              this.canMoveHeader = true;
              return;
            }
          }
          if (!mostTopRect) {
            mostTopRect = elRect;
          }
          stickyAndRendered.push(i);
        }
      }

      if (stickyAndRendered.length) {
        this.viewport.stickyRowHeaderContainer.style.top = mostTopRect.top + 'px';
        this.cloneAndMoveRow(this.viewport.stickyRowHeaderContainer,  headerRows.rows, stickyAndRendered, this.movedHeaderRows);
      }
    }
  }

  private moveFooter(offset: number, viewPortElRect: ClientRect | DOMRect): void {
    if (!this.runningFooter || this.canMoveFooter) {
      this.runningFooter = true;
      this.canMoveFooter = false;

      const stickyAndRendered: number[] = [];
      const footerRows = this.metaRows.footer;
      let mostTopRect: ClientRect | DOMRect;
      for (let i = 0, len = footerRows.rows.length; i < len; i++) {
        const rowEl = footerRows.rows[i];
        if (footerRows.sticky[i]) {
          const elRect = rowEl.getBoundingClientRect();
          if (footerRows.rendered[i]) {
            const calc = elRect.bottom - viewPortElRect.bottom + offset;

            // if after the scroll the element is still in view, return
            if (calc >= 0 && calc < viewPortElRect.height) {
              this.canMoveFooter = true;
              return;
            }
          }
          mostTopRect = elRect;
          stickyAndRendered.push(i);
        }
      }

      if (stickyAndRendered.length) {
        this.viewport.stickyRowFooterContainer.style.bottom = `calc(100% - ${mostTopRect.bottom}px)`
        this.cloneAndMoveRow(this.viewport.stickyRowFooterContainer, footerRows.rows, stickyAndRendered, this.movedFooterRows);
      }
    }
  }

  private restoreHeader(): boolean {
    if (this.runningHeader) {
      const movedHeaderRows = this.movedHeaderRows;
      this.movedHeaderRows = [];
      this.restoreRows(movedHeaderRows, this.metaRows.header.rows);
      this.runningHeader = false;
      this.canMoveHeader = true;
      return true;
    }
    return false;
  }

  private restoreFooter(): boolean {
    if (this.runningFooter) {
      const movedFooterRows = this.movedFooterRows;
      this.movedFooterRows = [];
      this.restoreRows(movedFooterRows, this.metaRows.footer.rows);
      this.runningFooter = false;
      this.canMoveFooter = true;
      return true;
    }
    return false;
  }

  private cloneAndMoveRow(stickyRowContainer: HTMLElement,
                          rows: HTMLElement[],
                          stickyAndRendered: number[],
                          restoreRef: Array<[HTMLElement, HTMLElement, number]>): void {
    const innerRowContainer = stickyRowContainer.firstElementChild as HTMLElement;
    stickyRowContainer.style.width = this.viewport.innerWidth + 'px';
    innerRowContainer.style.transform = `translateX(-${this.viewPortEl.scrollLeft}px)`;
    for (const i of stickyAndRendered) {
      const rowEl = rows[i];
      const clone = rowEl.cloneNode() as HTMLElement;
      clone.style.width = '0';
      rowEl.style.top = rowEl.style.bottom = rowEl.style.position = '';
      rowEl.parentElement.insertBefore(clone, rowEl);
      innerRowContainer.appendChild(rowEl);
      restoreRef.push([rowEl, clone, i]);
      // Assign the clone to be the sticky row element, this will ensure that stick row updates
      // will set the `top` on an actual element in the viewport, thus updating with each layout reflow.
      // if not set, when we return the original row it's `top` value will be true but will not show because it will not trigger a reflow.
      rows[i] = clone;
    }
  }

  private restoreRows(restoreRef: Array<[HTMLElement, HTMLElement, number]>, rows: HTMLElement[]): void {
    for (const [rowEl, clone, index] of restoreRef) {
      rowEl.style.position = clone.style.position;
      rowEl.style.zIndex = clone.style.zIndex;
      rowEl.style.top = clone.style.top;
      rowEl.style.bottom = clone.style.bottom;

      clone.parentElement.insertBefore(rowEl, clone);
      clone.parentElement.removeChild(clone);
      rows[index] = rowEl;
    }
  }
}
