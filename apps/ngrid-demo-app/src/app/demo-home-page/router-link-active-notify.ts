import { Subscription, ReplaySubject } from 'rxjs';
import { Directive, ContentChildren, Input, Output, OnChanges, OnDestroy, AfterContentInit, QueryList, SimpleChanges } from '@angular/core';
import { RouterLinkWithHref, RouterLink, Router, NavigationEnd, RouterEvent } from '@angular/router';

/**
 * Similar to `RouterLinkActive` from `@angular/router` but instead of updating a class o the dom will notify through an `@Output`.
 *
 * > Does not work on a single `RouterLink` / `RouterLinkWithHref`, only work as an ancestor of a list of `RouterLink` or `RouterLinkWithHref`
 */
@Directive({
  selector: '[routerLinkActiveNotify]',
  exportAs: 'routerLinkActiveNotify',
})
export class RouterLinkActiveNotify implements OnChanges, OnDestroy, AfterContentInit {
  @ContentChildren(RouterLink, { descendants: true }) links: QueryList<RouterLink>;
  @ContentChildren(RouterLinkWithHref, { descendants: true }) linksWithHrefs: QueryList<RouterLinkWithHref>;
  private subscription: Subscription;
  public readonly isActive: boolean = false;

  @Input() whichRouterLinkActive: { exact: boolean } = {exact: false};

  @Output() activeLinkChanged = new ReplaySubject<{ isActive: boolean; findRouterLink: (commands: any[]|string) => RouterLinkWithHref | RouterLink | undefined; }>(1);

  private activeLinks: Array<RouterLink | RouterLinkWithHref> = [];

  constructor(private router: Router) {
    this.subscription = router.events.subscribe((s: RouterEvent) => {
      if (s instanceof NavigationEnd) {
        this.update();
      }
    });
  }

  ngAfterContentInit(): void {
    this.links.changes.subscribe(_ => this.update());
    this.linksWithHrefs.changes.subscribe(_ => this.update());
    this.update();
  }

  ngOnChanges(changes: SimpleChanges): void { this.update(); }
  ngOnDestroy(): void { this.subscription.unsubscribe(); }

  private update(): void {
    if (!this.links || !this.linksWithHrefs || !this.router.navigated) return;
    Promise.resolve().then(() => {
      const activeLinks = this.getActiveLinks();
      const isActive = activeLinks.length > 0;
      if (this.statusHasChanged(isActive, activeLinks)) {
        (this as any).isActive = isActive;
        this.activeLinks = activeLinks;
        this.activeLinkChanged.next({ isActive, findRouterLink: this.findRouterLink.bind(this) });
      }
    });
  }

  private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
    return (link: RouterLink | RouterLinkWithHref) =>
               router.isActive(link.urlTree, this.whichRouterLinkActive.exact);
  }

  private getActiveLinks(): Array<RouterLink | RouterLinkWithHref> {
    const isActiveCheckFn = this.isLinkActive(this.router);
    return this.links.filter(isActiveCheckFn).concat(this.linksWithHrefs.filter(isActiveCheckFn) as any);
  }

  private statusHasChanged(isActive: boolean, activeLinks: Array<RouterLink | RouterLinkWithHref>): boolean {
    if (this.isActive !== isActive) {
      return true;
    }
    if (this.activeLinks.length !== activeLinks.length) {
      return true;
    }
    if (activeLinks.length > 0) {
      for (const activeLink of activeLinks) {
        if (this.activeLinks.indexOf(activeLink) === -1) {
          return true;
        }
      }
    }
    return false;
  }

  private findRouterLink(commands: any[]|string): RouterLinkWithHref | RouterLink | undefined {
    if (this.isActive && this.activeLinks[0]) {
      const routerLinkWrapper: RouterLink = Object.create(this.activeLinks[0]);
      routerLinkWrapper.routerLink = commands;
      const url = routerLinkWrapper.urlTree.toString();
      return this.activeLinks.find( al => al.urlTree.toString() === url );
    }
  }

}
