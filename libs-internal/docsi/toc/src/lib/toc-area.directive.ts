import { Observable, Subscription, BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { AfterContentInit, Directive, ElementRef, Input, OnDestroy, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TocHeadDirective } from './toc-head.directive';
import { tocLinkfromStaticElement } from './toc-link';
import { TOC_AREA_DIRECTIVE_TOKEN } from './toc-area.token';

const DEFAULT_OFFSET_CACHE: [number, number] = [0, 0];

const DEFAULT_SELECTOR = `h1[id]:not(.no-toc), h2[id]:not(.no-toc), h3[id]:not(.no-toc)\
, h1 > a[id].anchor, h2 > a[id].anchor, h3 > a[id].anchor`;

function isPromise<T>(value: any | Promise<T>): value is Promise<T> {
  return value && typeof (<any> value).subscribe !== 'function' && typeof (value as any).then === 'function';
}

/**
 * A logical container and unit of work for a table of contents.
 * [[TocAreaDirective]] represents A group of [[TocHeadDirective]] and with them form an instance of
 * table of contents.
 *
 * [[TocAreaDirective]] contains the logic for handling the behaviour, which includes
 * adding/removing [[TocHeadDirective]] instances and handling scrolling to reflect the active
 * link.
 *
 * [[TocComponent]] uses [[TocAreaDirective]] to create a UI representation of the TOC.
 *
 * [[TocAreaDirective]] can works in a Directive mode or in standalone mode.
 *
 * ## Directive mode
 * In this mode, [[TocAreaDirective]] works with the [[TocHeadDirective]] directive using the
 * angular DI system and collects all instances of [[TocHeadDirective]] within its scope.
 * When the angular router is used, [[TocAreaDirective]] will use [[ActivatedRoute]] via DI
 * to automatically detect changes to the fragment portion of the URL and will try to scroll to
 * the link representing the fragment.
 *
 * > The HTML element H1, H2 and H3 when set with an `id` attribute (`<h1 id="4">Title</h1>`) are
 * triggered by [[TocHeadDirective]], to exclude such elements add the class `no-toc`.
 *
 * ## Standalone mode
 * In this mode, [[TocAreaDirective]] requires manual instantiation by the developer and does not
 * go through the templates.
 * Standalone mode provides TOC support for static HTML content where [[TocHeadDirective]] are
 * manually created by searching for matching elements using the querySelector API.
 * [[TocHeadDirective]] support this scenario with [[TocAreaDirective#fromElement]]
 *
 * To automatically scroll a header link element into view when the fragment portion of a URL has
 * changed the developer needs to manually register to such notification and then use
 * [[TocAreaDirective.scrollTo]] to try and scroll it into view.
 * An alternative, easier way, is to initialize [[TocAreaDirective]] with an [[ActivatedRoute]]
 * instance and [[TocAreaDirective]] will take care of fragment changes.
 */
@Directive({
  selector: '[docsiTocArea]',
  exportAs: 'docsiTocArea',
  providers: [
    { provide: TOC_AREA_DIRECTIVE_TOKEN, useExisting: TocAreaDirective }, // We use a token to prevent circular dep warning cause TocAreaDirective is runtime-used here
  ]
})
export class TocAreaDirective implements AfterContentInit, OnDestroy {
  @Input()
  set scrollContainer(value: Element) {
    this._isWindowContainer = !value;
    const scrollContainer = value || window;
    if (scrollContainer !== this._scrollContainer) {
      if (this._scrollSubscription) {
        this._scrollSubscription.unsubscribe();
      }
      this._scrollContainer = scrollContainer;
      if (scrollContainer) {
        this._scrollSubscription = fromEvent(this._scrollContainer, 'scroll')
          .pipe(debounceTime(10))
          .subscribe(() => this.onScroll());
      }
    }
  }

  @Input() tocTitle: string;

  /**
   * When true will treat the internal content as static and will query for possible links.
   * Query selector can be customised in [[TocAreaDirective.selector]].
   *
   * > Using `staticHtmlMode` when angular renders the internal content is possible but not
   * recommended. Duplicate links will register (has workaround) and order is not preserved,
   * angular elements will comes before or after static elements. (before on first route rendering,
   * after on 2nd route rendering [same route, different params])
   */
  @Input() staticHtmlMode: boolean | Promise<any>;

  /**
   * The selector to use when `staticHtmlMode` is true.
   * When not set default to [[TocAreaDirective#defaultSelector]]
   *
   * You can apply generic selector such as `a[id][name][level]` or to work in `staticHtmlMode` and
   * support link elements activated by angular without duplication: `a[id][name][level]:not([ng-reflect-id])`
   */
  @Input() selector: string;

  readonly hasLinks: Observable<boolean>;
  readonly linksChanged: Observable<TocHeadDirective[]>;
  readonly activeLinkChanged: Observable<TocHeadDirective | undefined>;

  private links: TocHeadDirective[] = [];
  private _linksChanged$: BehaviorSubject<TocHeadDirective[]>;
  private _activeLink$: BehaviorSubject<TocHeadDirective | undefined>;
  private _fragmentSubscription: Subscription;
  private _scrollSubscription: Subscription;

  private _urlFragment = '';
  private _scrollContainer: Element | Window;
  private _lastHeight: number;
  private _isWindowContainer: boolean;
  private _offsetCache: [number, number] = DEFAULT_OFFSET_CACHE;

  private get containerHeight(): number {
    return this._isWindowContainer
      ? (<Window> this._scrollContainer).innerHeight
      : (<HTMLElement> this._scrollContainer).scrollHeight;
  }

  /** Gets the scroll offset of the scroll container */
  private get getScrollOffset(): number {
    return this._isWindowContainer
      ? (<Window> this._scrollContainer).pageYOffset
      : (<HTMLElement> this._scrollContainer).scrollTop +
          (<HTMLElement> this._scrollContainer).getBoundingClientRect().top;
  }

  constructor(@Optional() route?: ActivatedRoute, @Optional() private elRef?: ElementRef) {
    this._activeLink$ = new BehaviorSubject<TocHeadDirective | undefined>(undefined);
    this._linksChanged$ = new BehaviorSubject<TocHeadDirective[]>(this.links);
    this.linksChanged = this._linksChanged$.asObservable();
    this.activeLinkChanged = this._activeLink$.asObservable();
    this.hasLinks = this._linksChanged$.pipe(
      map( links => links.length > 1 ),
      distinctUntilChanged(),
    );

    if (route) {
      this._fragmentSubscription = route.fragment.subscribe(fragment => {
        this._urlFragment = fragment;
        if (fragment) {
          this.scrollTo(fragment);
        }
      });
    }
  }

  /**
   * Creates an instance of [[TocHeadDirective]] for use outside of angular.
   * This will allow treating [[TocHeadDirective]] as a simple class to implement TOC on static
   * HTML content using querySelector API.
   * @param element
   * @param tocArea
   * @return {TocHeadDirective}
   */
  static fromElement(element: HTMLElement, tocArea: TocAreaDirective): TocHeadDirective {
    const staticLink = tocLinkfromStaticElement(element);
    const tocHead = new TocHeadDirective(new ElementRef(staticLink.element), tocArea);
    Object.assign(tocHead.link, staticLink.link);
    tocArea.initLink(tocHead);
    return tocHead;
  }

  ngAfterContentInit(): void {
    const el: HTMLElement = this.elRef && this.elRef.nativeElement;
    if (el && isPromise(this.staticHtmlMode)) {
      this.staticHtmlMode.then( () => {
        this.queryLinksAndAdd(el);
      });
    } else if (el && coerceBooleanProperty(this.staticHtmlMode)) {
      this.queryLinksAndAdd(el);
    }
  }

  reinitQueryLinks(p: Promise<any>): void {
    const el: HTMLElement = this.elRef && this.elRef.nativeElement;
    p.then( () => {
      setTimeout( () => {
        this.links = [];
        this.queryLinksAndAdd(el);
        this._linksChanged$.next(this.links);
      }, 25);
    });
  }

  /**
   * analyze link and publish links changed event
   * @param tocLink
   */
  initLink(tocLink: TocHeadDirective): void {
    if (this._urlFragment && this._urlFragment === tocLink.link.id) {
      this.scrollIntoView(tocLink);
    }
    this._linksChanged$.next(this.links);
  }

  /**
   * Add the tocLink to the collection but does not analyze or publish links changed event
   * @param tocLink
   */
  add(tocLink: TocHeadDirective): void {
    this.links.push(tocLink);
  }

  remove(tocLink: TocHeadDirective): void {
    const linkIdx = this.links.indexOf(tocLink);
    if (linkIdx > -1) {
      this.links.splice(linkIdx, 1);
      this._linksChanged$.next(this.links);
      if (linkIdx <= this._offsetCache[1]) {
        this._offsetCache = DEFAULT_OFFSET_CACHE;
      }
    }
  }

  ngOnDestroy(): void {
    this._linksChanged$.complete();
    this._activeLink$.complete();
    if (this._fragmentSubscription) {
      this._fragmentSubscription.unsubscribe();
    }
    if (this._scrollSubscription) {
      this._scrollSubscription.unsubscribe();
    }
  }

  /**
   * Try to find a [[TocHeadDirective]] using the supplied `fragment`
   * (i.e. fragment equals [[TocLink.id]]) and if found scroll it into view.
   * @param fragment
   */
  scrollTo(fragment: string): void {
    const tocLink = this.links.find(l => l.link.id === fragment);
    if (tocLink) {
      this.scrollIntoView(tocLink);
    }
  }

  private scrollIntoView(tocLink: TocHeadDirective): void {
    // scroll after angular finishes rendering the page
    // so resizing operation, element init expansion etc are taking into consideration
    setTimeout(() => {
      this._activeLink$.next(tocLink);
      tocLink.scrollIntoView();
    });
  }

  private queryLinksAndAdd(el: HTMLElement): void {
    const headers = el.querySelectorAll(this.selector || DEFAULT_SELECTOR);
    Array.from(headers).forEach(node => {
      TocAreaDirective.fromElement(<any> node, this);
    });
  }

  private onScroll(): void {
    const height = this.containerHeight;
    const scrollOffset = this.getScrollOffset;

    /* We check if the height of the scroll container has changed since last scroll
       If it changed we need to calculate all top positions for the links elemnts as they might
       have change. A good example is an expending element that when opened or closed change the top
       position for all header links below it. */
    if (height !== this._lastHeight) {
      let offset = scrollOffset;

      // The top position of the header link DOM element contains the top section
      // and the scrollOffset also contains it, we reduce one.
      if (!this._isWindowContainer) {
        offset -= (<HTMLElement> this._scrollContainer).getBoundingClientRect().top;
      }

      for (let i = 0, len = this.links.length; i < len; i++) {
        this.links[i].reCalcPosition(offset);
      }

      // cache the height
      this._lastHeight = height;
    }

    this.setActive(scrollOffset);
  }

  /**
   * Set the active header link based on the scrolling offset.
   * The implementation assumes linear scrolling is common so each call to setActive creates a state
   * for the next call to come. The state holds the last offset and active link index.
   * With the state the direction of the scroll is known, and based on the direction of scrolling
   * the array of links is iterated (up/down) from that last active index.
   *
   * This will average iterations to O(1), when each scroll usually either doesn't change the active
   * header or changes it to the next/prev header.
   * @param scrollOffset
   */
  private setActive(scrollOffset: number): void {
    const arr = this.links;
    const direction = scrollOffset >= this._offsetCache[0] ? 1 : -1;
    for (let i = this._offsetCache[1]; !!arr[i]; i = i + direction) {
      if (this.isLinkActive(scrollOffset, arr[i], arr[i + 1])) {
        if (arr[i] !== this._activeLink$.getValue()) {
          this._offsetCache = [scrollOffset, i];
          this._activeLink$.next(arr[i]);
        }
        return;
      }
    }

    this._offsetCache = DEFAULT_OFFSET_CACHE;
    this._activeLink$.next(undefined);
  }

  private isLinkActive(scrollOffset: number, currentLink: TocHeadDirective, nextLink: TocHeadDirective): boolean {
    // A link is considered active if the page is scrolled passed the anchor without also
    // being scrolled passed the next link
    return scrollOffset >= currentLink.link.top && !(nextLink && nextLink.link.top < scrollOffset);
  }

  static get defaultSelector(): typeof DEFAULT_SELECTOR {
    return DEFAULT_SELECTOR;
  }
}
