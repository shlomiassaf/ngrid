import { Observable, Subject } from 'rxjs';

export class RowIntersectionTracker {
  get observerMode() { return !!this.intersectionObserver; }

  readonly intersectionChanged: Observable<IntersectionObserverEntry[]>;
  private readonly intersectionObserver: IntersectionObserver;

  constructor(rootElement: HTMLElement, forceManual?: boolean) {
    const intersectionChanged = this.intersectionChanged = new Subject<IntersectionObserverEntry[]>();

    if (!forceManual && !!IntersectionObserver) {
      this.intersectionObserver = new IntersectionObserver(entries => intersectionChanged.next(entries), {
        root: rootElement,
        rootMargin: '0px',
        threshold: 0.0,
      });
    }

  }

  snapshot() {
    return this.intersectionObserver?.takeRecords() ?? [];
  }

  track(element: HTMLElement) {
    this.intersectionObserver?.observe(element);
  }

  untrack(element: HTMLElement) {
    this.intersectionObserver?.unobserve(element);
  }

  destroy() {
    (this.intersectionChanged as Subject<any>).complete();
    this.intersectionObserver?.disconnect();
  }
}
