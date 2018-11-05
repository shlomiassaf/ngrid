import { AfterViewInit, Directive, ElementRef, HostBinding, Input, Inject, OnDestroy, Optional } from '@angular/core';

import { TocAreaDirective } from './toc-area.directive';
import { TocLink, createLink } from './toc-link';
import { TOC_AREA_DIRECTIVE_TOKEN } from './toc-area.token';

/**
 * A directive that represents a header that has a TOC record (link).
 *
 * Automatically set H1, H2 and H3 elements that has an `id` attribute (`<h1 id="4">Title</h1>`).
 * To exclude an H1, H2 or H3 elements (that has an id) add the class `no-toc` to it.
 *
 * Other elements can also be used as link headers, to mark them add the `negTocHead` attribute to
 * them following and id attribute. If the element is not an [[HTMLHeadingElement]] (Hx) it is
 * mandatory to set the `level` (1 to n) attribute. (`<a id="link" name="title" level="2"></a>`)
 *
 * The title used in the TOC is the value in the `name` attribute (Input binging supported) or
 * if not set, the innerText value of the element. Usually the inner text is sufficient unless it
 * includes context that is not visible via CSS / JS.
 *
 * A link directive/element can set/override the `level` value by setting it on the
 * html element explicitly. If set, the attribute overrides the Heading level.
 *
 * This directive is built with support for TOC on static HTML content using the querySelector API.
 * See [[TocAreaDirective#fromElement]]
 */
@Directive({
  selector: '[docsi-toc][id]:not([no-toc])', //, h1[id]:not(.no-toc), h2[id]:not(.no-toc), h3[id]:not(.no-toc)',
})
export class TocHeadDirective implements AfterViewInit, OnDestroy {
  link: TocLink = {
    name: '',
    level: 1,
    top: 0,
    id: ''
  };

  // HostBinding + Input to reflect input for static caching.
  /**
   * Ths ID, used as link reference.
   */
  @HostBinding('attr.id')
  @Input()
  id: string;

  /**
   * The name to display in the TOC, if not set taken from the innerText of the element.
   */
  @HostBinding('attr.name')
  @Input()
  name: string;
  /**
   * The level in the TOC.
   * Valid values from 0 to n.
   * Mandatory, unless the element is Hx which will result in x being the level.
   *
   * > When used as directive, the supported elements are h1, h2 and h3.
   * To use height H elements add the `negTocHead` attribute (level will be taken from tag name)
   */

  @HostBinding('attr.level')
  @Input()
  level: number;

  private el: HTMLElement;

  readonly enabled: boolean;
  private tocArea: TocAreaDirective;

  constructor(elementRef: ElementRef, @Inject(TOC_AREA_DIRECTIVE_TOKEN) @Optional() tocArea: any) {
    this.enabled = !!tocArea;
    if (this.enabled) {
      this.tocArea = tocArea;
      this.el = elementRef.nativeElement;
      this.tocArea.add(this);
    }
  }

  ngAfterViewInit(): void {
    if (this.enabled) {
      this.addToService();
    }
  }

  scrollIntoView(): void {
    this.el.scrollIntoView();
  }

  ngOnDestroy(): void {
    if (this.enabled) {
      this.tocArea.remove(this);
    }
  }

  reCalcPosition(scrollTop: number): void {
    this.link.top = this.el.getBoundingClientRect().top + scrollTop;
  }

  private addToService(): void {
    if (!this.link.name) {
      // because we bind @Inputs id,name,level to their respective attributes
      // they are now in the element and createLink will grab them.
      this.link = createLink(this.el);
    }
    if (this.link.name && this.link.id) {
      this.tocArea.initLink(this);
    }
  }
}
