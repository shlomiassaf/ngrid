import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { RouterLinkWithHref, RouterLink } from '@angular/router';
import { MarkdownPagesMenuService, LocationService } from '@pebula/apps/shared';
import { SearchService, SearchResults } from '@pebula/apps/shared-data';

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
  private _demoLinks: Array<{ cmd: any[], text: string }>;

  constructor(private mdMenu: MarkdownPagesMenuService,
              private searchService: SearchService,
              private locationService: LocationService) {
    // Delay initialization by up to 2 seconds
    this.searchService.loadIndex(this.searchService.hasWorker ? 2000 : 0)
      .subscribe( event => console.log('Search index loaded'))
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
