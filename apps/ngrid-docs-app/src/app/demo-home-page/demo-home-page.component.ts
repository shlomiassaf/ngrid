import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterLink } from '@angular/router';
import { Dir } from '@angular/cdk/bidi';
import { MatMenu } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';

import { MarkdownPagesMenuService, LocationService, ViewLayoutObserver, SearchService, SearchResults } from '@pebula/apps/docs-app-lib';
import { PageAssetNavEntry } from '@pebula-internal/webpack-markdown-pages/models';

@Component({
  selector: 'pbl-demo-home-page',
  templateUrl: './demo-home-page.component.html',
  styleUrls: ['./demo-home-page.component.scss']
})
export class DemoHomePageComponent {

  showSearchResults: boolean;
  searchResults: Observable<SearchResults>;

  selectedDemoLink: any;

  topMenuItems: ReturnType<MarkdownPagesMenuService['ofType']>;
  demoLinks: Promise<Array<{ cmd: any[], text: string }>>;

  isRtl: boolean;

  private _demoLinks: Array<{ cmd: any[], text: string }>;

  constructor(public readonly viewLayout: ViewLayoutObserver,
              public readonly mdMenu: MarkdownPagesMenuService,
              private searchService: SearchService,
              private locationService: LocationService,
              private readonly dir: Dir) {
    // Delay initialization by up to 2 seconds
    this.searchService.loadIndex(this.searchService.hasWorker ? 2000 : 0)
      .subscribe( event => console.log('Search index loaded'))
  }

  rtlToggleChanged() {
    this.isRtl = !this.isRtl;
    this.dir.dir = this.isRtl ? 'rtl' : 'ltr';
  }

  handleMobileTopMenuSubMenu(select: MatSelect, menu: MatMenu, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    menu.closed.pipe(take(1)).subscribe( () => select.close() );
    return false;
  }

  ngOnInit() {
    this.topMenuItems = this.mdMenu.ofType('topMenuSection');
    this.demoLinks = this.mdMenu.ofType('singlePage')
    .then( entries => {
      const demoLinks = entries
        .filter( e => e.subType === 'demoPage' )
        .map( e => {
          return {
            cmd: e.path.split('/'),
            text: e.title
          }
        });
      return this._demoLinks = demoLinks;
    });
  }

  demoLinkStatusChanged(event: { isActive: boolean; findRouterLink: (commands: any[]|string) => RouterLinkWithHref | RouterLink | undefined; }) {
    this.selectedDemoLink = null;
    if (event.isActive) {
      if (!this._demoLinks) {
        this.demoLinks.then( () => this.demoLinkStatusChanged(event) );
        return;
      }
      this.selectedDemoLink = this._demoLinks.find( dl => !!event.findRouterLink(dl.cmd) );
    }
  }

  mobileTopMenuRouteActivated(select: MatSelect,
                              items: PageAssetNavEntry[],
                              event: { isActive: boolean; findRouterLink: (commands: any[]|string) => RouterLinkWithHref | RouterLink | undefined; }) {
    if (event.isActive) {
      select.value = items.find( dl => !!event.findRouterLink(dl.path.split('/')) );
    } else if (this.selectedDemoLink) {
      select.value = 'Demo';
    } else {
      select.value = undefined;
    }
  }

  doSearch(query: string) {
    this.searchResults = this.searchService.queryIndex(query);
    this.showSearchResults = !!query;
  }

  hideSearchResults() {
    this.showSearchResults = false;
    const oldSearch = this.locationService.search();
    if (oldSearch.search !== undefined) {
      this.locationService.setSearch('', { ...oldSearch, search: undefined });
    }
  }
}
