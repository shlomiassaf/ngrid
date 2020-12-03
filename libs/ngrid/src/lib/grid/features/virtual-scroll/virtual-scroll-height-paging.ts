import { PblCdkVirtualScrollViewportComponent } from './virtual-scroll-viewport.component';

/* Height limits
    Chrome / Safari: ~34m
    FireFox: ~17m
*/
// TODO: Modify this based on browser, for Firefox, give 10m, chrome/safari should get a higher value
const MAX_SCROLL_HEIGHT = 10000000;

export class VirtualScrollHightPaging {
  totalHeight: number;
  pageHeight: number;
  pageCount: number;
  coff: number;
  prevScrollOffset: number;
  offset: number;
  page: number;
  afterToEnd = false;

  private active = false;

  constructor(private viewport: PblCdkVirtualScrollViewportComponent) {
    const onContentScrolled = viewport.pblScrollStrategy.onContentScrolled;
    viewport.pblScrollStrategy.onContentScrolled = () => {
      if (this.active) {
        const scrollOffset = viewport.element.scrollTop;
        const delta = scrollOffset - this.prevScrollOffset;
        const viewportSize =  viewport.getViewportSize();
        if (Math.abs(delta) > viewportSize) {
          this.page = Math.floor(scrollOffset * ((this.totalHeight - viewportSize) / (MAX_SCROLL_HEIGHT - viewportSize)) * (1 / this.pageHeight));
          this.offset = Math.round(this.page * this.coff);
          this.prevScrollOffset = scrollOffset;
        } else if (this.prevScrollOffset !== scrollOffset) {
          // next page
          if (delta > 0 && scrollOffset + this.offset > (this.page + 1) * this.pageHeight) {
            this.page += 1;
            this.offset += this.coff;
            viewport.element.scrollTop = this.prevScrollOffset = Math.floor(scrollOffset - this.coff);
            return;
          }
          // prev page
          else if (delta < 0 && scrollOffset + this.offset < this.page * this.pageHeight) {
            this.page -= 1;
            this.offset -= this.coff;
            viewport.element.scrollTop = this.prevScrollOffset = Math.floor(scrollOffset + this.coff);
            return;
          }
          else {
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
    if (totalHeight <= MAX_SCROLL_HEIGHT) {
      this.active = undefined;
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
    return totalHeight;
  }
}
