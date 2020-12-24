import { Subject } from 'rxjs';
import { calculateBrowserPxLimit } from './utils';
import { PblCdkVirtualScrollViewportComponent } from './virtual-scroll-viewport.component';

/**
 * Logic for height paging:
 *
 * The whole logic is here to workaround browser issues with PX limit.
 * With virtual scroll we simulate the height by rendering a small viewport size box that inside
 * we create a fake element that simulate the height of the total items we need to render.
 * When the user scrolls we calculate the items that should be rendered for that scroll position.
 *
 * This is ok, until we reach a limit of maximum height/width a browser can handle which is implementation based.
 * Chrome will break on 34m PX, same for safari but firefox (OSX) it's 17m.
 *
 * What paging does is set a fixed height, which is below the limit of the browser.
 * Then fit the total height required into the fixed height we defined using math.
 *
 * This is done via pages. We split the scroll area into pages, each page we go over will offset the scroll bar a bit
 * to compensate for the gap between the total height and the fixed height.
 *
 * For example, if the total items height is 1000px and the fixed height is 600px, we have a 400px height to compensate while scrolling.
 * If we have 11 pages, that's 10 pages we swap, each swap should compensate 40px so we will in total compensate 400px.
 * When the user scroll's down and reaches the "page" we slightly shift the scroll bar up 40px, giving us 40px more to scroll down, 10 times like this and we get 400px additional scroll area
 * which is what we need for all of our items.
 *
 * This is the theory, in practice this depends on the scroll delta, on large scrolls we can't change the actual scroll position, we just recalculate the current page/offset
 * On small delta's we do calculate and if a fix is required we will do it.
 *
 * This "fix" only happen when the scroll position + delta moves us from a page to the next/prev page.
 * Since we're talking large scale here, the pages are quite big so getting to that point should be rare.
 *
 * The logic here is incomplete, especially when switching from location based calculation where we set the page/offset based on the scroll offset
 * To page based calculation where we calculate the location (scroll offset) based on the page/offset we're in.
 *
 * The 2 methods can't work together because if you do a paged based calc you push the scroll offset which will reflect on the next location based calc.
 *
 * The 2 methods run based on the scroll delta, on large scroll gaps we want to do location based calc because we don't really scroll it might be wheel but also might be dragging the bar.
 * On small incremental wheel events we want to determine when the page shifts.
 *
 * In general, we want to have lower page height which means more offset points.
 * This means more places where the user can "see" these jumps but each jump is minimal.
 * However, if we do large page height, less jumps, we probably be in a situation where the user never see these jumps.
 * The problem is, when the jumps occurs the whole math is useless, and this happens on MOST up scrolls.
 *
 * This is to say, we need to refactor this process to use only one method and find the sweet spot for the page height.
 * Maybe 3 X ViewPort size...
 */

// const LOG = msg => console.log(msg) ;

/* Height limits: Chrome,  Safari: ~34m | FireFox: ~17m
*/
const MAX_SCROLL_HEIGHT = calculateBrowserPxLimit();

export class VirtualScrollHightPaging {
  totalHeight: number;
  pageHeight: number;
  pageCount: number;
  coff: number;
  prevScrollOffset: number;
  offset: number;
  page: number;
  afterToEnd = false;

  active = false;

  activeChanged = new Subject<void>();

  constructor(private viewport: PblCdkVirtualScrollViewportComponent) {
    const onContentScrolled = viewport.pblScrollStrategy.onContentScrolled;
    viewport.pblScrollStrategy.onContentScrolled = () => {
      if (this.active) {
        const scrollOffset = viewport.element.scrollTop;
        const delta = scrollOffset - this.prevScrollOffset;
        const viewportSize =  delta > 0 ? viewport.getViewportSize() : 80;

        if (Math.abs(delta) > viewportSize) {
          // LOG(`DELTA#BEFORE ${scrollOffset} - ${this.page}`);
          this.page = Math.floor(scrollOffset * ((this.totalHeight - viewportSize) / (MAX_SCROLL_HEIGHT - viewportSize)) * (1 / this.pageHeight));
          // LOG(`DELTA ${scrollOffset} - ${this.page}`);
          this.offset = Math.round(this.page * this.coff);
          this.prevScrollOffset = scrollOffset;
        } else if (this.prevScrollOffset !== scrollOffset) {
          // next page
          if (delta > 0 && scrollOffset + this.offset > (this.page + 1) * this.pageHeight) {
            // LOG(`NEXT ${scrollOffset}`);
            this.page += 1;
            this.offset += this.coff;
            viewport.element.scrollTop = this.prevScrollOffset = Math.floor(scrollOffset - this.coff);
            // LOG(`NEXT# 2 ${viewport.element.scrollTop}`);
            return;
          }
          // prev page
          else if (delta < 0 && scrollOffset + this.offset < this.page * this.pageHeight) {
            // LOG(`PREV ${scrollOffset}`);
            this.page -= 1;
            this.offset -= this.coff;
            viewport.element.scrollTop = this.prevScrollOffset = Math.floor(scrollOffset + this.coff);
            // LOG(`PREV# 2 ${viewport.element.scrollTop}`);
            return;
          }
          else {
            // LOG(`SKIP ${scrollOffset}`);
            this.prevScrollOffset = scrollOffset;
          }
        }
      }
      onContentScrolled.call(viewport.pblScrollStrategy);
    }
  }

  transformScrollOffset(originalOffset: number): number {
    return originalOffset + (this.active ? this.offset : 0);
  }

  transformOffsetToRenderedContentStart(originalRenderContentStart: number | null): number | null {
    return (!originalRenderContentStart || !this.active)
     ? originalRenderContentStart
     : originalRenderContentStart + this.offset
    ;
  }

  transformRenderedContentOffset(offset: number, to: 'to-start' | 'to-end' = 'to-start'): number {
    if (this.active) {
      if (!this.afterToEnd) {
        offset -= this.offset;
      }
      this.afterToEnd = to === 'to-end';
    }
    return offset;
  }

  transformTotalContentSize(totalHeight: number, scrollOffset: number): number {
    const wasActive = !!this.active;
    if (totalHeight <= MAX_SCROLL_HEIGHT) {
      this.active = false;
    } else if (this.totalHeight !== totalHeight) {
      this.active = true;
      this.totalHeight = totalHeight;
      this.pageHeight = MAX_SCROLL_HEIGHT / 100;
      this.pageCount = Math.ceil(totalHeight / this.pageHeight);
      this.coff = Math.floor((totalHeight - MAX_SCROLL_HEIGHT) / (this.pageCount - 1));
      this.prevScrollOffset = scrollOffset;
      this.offset = this.offset || 0;
      this.page = this.page || 0;
      this.afterToEnd = !!this.afterToEnd;
      totalHeight = MAX_SCROLL_HEIGHT;
    }
    if (wasActive !== this.active) {
      this.activeChanged.next();
    }
    return totalHeight;
  }

  shouldTransformTotalContentSize(totalHeight: number): boolean {
    if (totalHeight <= MAX_SCROLL_HEIGHT) {
      this.active = false;
    } else if (this.totalHeight !== totalHeight) {
      return true;
    }
    return false;
  }

  dispose() {
    this.activeChanged.complete();
  }
}
