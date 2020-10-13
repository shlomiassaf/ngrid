import { Observable, Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Component, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';

import { utils } from '@pebula/ngrid';
import { TocAreaDirective } from '../../toc.module';

import { MarkdownPagesMenuService, NavEntry } from '../../services/markdown-pages-menu.service';
import { ViewLayoutObserver } from '../../services/view-layout-observer.service';

declare const ANGULAR_VERSION: string;
declare const CDK_VERSION: string;
declare const NGRID_VERSION: string;
declare const BUILD_VERSION: string;

@Component({
  selector: 'pbl-markdown-page-container',
  templateUrl: './markdown-page-container.component.html',
  styleUrls: ['./markdown-page-container.component.scss']
})
export class MarkdownPageContainerComponent implements OnDestroy {

  entry: string;
  documentUrl: string;
  pageRendered: boolean;
  @ViewChild('tocArea', { static: true, read: TocAreaDirective}) tocArea: TocAreaDirective;

  menu$ = new Subject<any>();

  ngVersion = ANGULAR_VERSION;
  cdkVersion = CDK_VERSION;
  ngridVersion = NGRID_VERSION;
  buildVersion = BUILD_VERSION;

  active: NavEntry;

  @ViewChild(MatDrawer) drawer: MatDrawer;

  mode: MatDrawerMode = 'side';

  private root: NavEntry;

  private layoutState = {
    hamburger: false,
    isWeb: true,
  }

  constructor(public readonly viewLayout: ViewLayoutObserver,
              public readonly mdPagesMenu: MarkdownPagesMenuService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.route.url
      .pipe(
        debounceTime(1),
        map( urlSegments => urlSegments.map(u => u.path) ),
        utils.unrx(this)
      )
      .subscribe( paths => this.handleUrlUpdate(paths) );

    this.viewLayout.isWeb$
      .pipe(utils.unrx(this))
      .subscribe( isWeb => {
        if (isWeb) {
          this.mode = 'side';
        } else {
          this.mode = 'over';
        }
        this.layoutState.isWeb = isWeb;
        this.setMenuState();
      });
  }

  ngOnDestroy(): void {
    this.menu$.complete();
    utils.unrx.kill(this);
  }

  getRouterLink(path: string): any[] {
    const routeLink = path.split('/');
    if (routeLink[0] !== '/') {
      routeLink.unshift('/');
    }
    return routeLink;
  }

  contentRendered(): void {
    this.pageRendered = true;
    this.tocArea.reinitQueryLinks(Promise.resolve())
      .then(() => this.cdr.detectChanges());
  }

  isExpanded(entry: NavEntry) {
    let e = this.active;
    while (e) {
      if (e === entry) {
        return true;
      }
      e = e.parent;
    }
    return false;
  }

  sideMenuClosed() {
    this.layoutState.hamburger = false;
  }


  toggleMobileMenu() {
    this.layoutState.hamburger = !this.layoutState.hamburger;
    this.setMenuState();
    this.cdr.markForCheck();
  }

  private setMenuState() {
    if (this.root?.children) {
      if (this.layoutState.isWeb || this.layoutState.hamburger) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    } else {
      this.drawer.close();
    }
  }

  private handleUrlUpdate(paths: string[]): void {
    this.layoutState.hamburger = false;
    this.drawer.close();
    this.active = undefined;
    this.pageRendered = false;
    this.documentUrl = paths.length ? paths.join('/') : '/';

    if (this.entry !== paths[0]) {
      this.mdPagesMenu.getMenu(this.entry = paths[0])
        .then( entry => {
          this.findActive(this.root = entry);
          this.menu$.next(entry);
          this.setMenuState();
          if (this.active && !this.active.dataPath && this.active.children) {
            this.handleUrlUpdate(this.active.children[0].path.split('/'));
          }
        })
        .catch(err => {
          this.menu$.next(null);
          this.root = undefined;
          this.setMenuState();
        });
    } else {
      this.root && this.findActive(this.root);
      this.setMenuState();
    }
  }

  private findActive(entry: NavEntry) {
    if (entry === this.root) {
      if (entry.children) {
        for (const e of entry.children) {
          const result = this.findActive(e);
          if (result) {
            this.active = result;
            break;
          }
        }
      }
      if (!this.active) {
        this.active = entry.children ? entry.children[0] : entry;
      }
      return this.active;
    }

    if (entry.path === this.documentUrl) {
      return entry;
    }

    if (entry.children) {
      for (const e of entry.children) {
        const result = this.findActive(e);
        if (result) {
          return result;
        }
      }
    }
  }
}
