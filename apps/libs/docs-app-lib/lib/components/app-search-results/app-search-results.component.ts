import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';

import { unrx } from '@pebula/ngrid/core';
import { SearchResults, SearchResult, SearchArea, SearchService } from '../../services/search';
import { MarkdownPagesMenuService } from '../../services/markdown-pages-menu.service';
import { ViewLayoutObserver } from '../../services/view-layout-observer.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './app-search-results.component.html',
  styleUrls: [ './app-search-results.component.scss' ],
  animations: [
    trigger('enterLeave', [
      transition(':enter', [
        style({height: '0', overflow: 'hidden'}),
        animate(250, style({height: '*'}))
      ]),
      transition(':leave', [
        style({height: '*'}),
        animate(250, style({height: 0}))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSearchResults implements OnChanges, OnDestroy {
    /**
   * The results to display
   */
  @Input() searchResults: SearchResults;

  /**
   * Emitted when the user selects a search result
   */
  @Output() resultSelected = new EventEmitter<SearchResult>();

  notFoundMessage: string = 'No results found.';
  searchAreas: SearchArea[] = [];
  readonly defaultArea = 'other';

  constructor(public readonly viewLayout: ViewLayoutObserver,
              public searchService: SearchService,
              private menu: MarkdownPagesMenuService,
              private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.searchResults) {
      this.searchAreas = this.processSearchResults(this.searchResults);
    }
  }

  ngOnDestroy(): void {
    unrx.kill(this);
  }

  onResultSelected(page: SearchResult, event: MouseEvent) {
    // Emit a `resultSelected` event if the result is to be displayed on this page.
    if (event.button === 0 && !event.ctrlKey && !event.metaKey) {
      this.resultSelected.emit(page);
    }
  }

  doSearch(query: string) {
    unrx.kill(this, this.searchService);
    this.searchService.queryIndex(query)
      .pipe(unrx(this, this.searchService))
      .subscribe( results => {
        this.searchResults = results;
        if (this.searchResults) {
          this.searchAreas = this.processSearchResults(this.searchResults);
        }
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
  }

  private processSearchResults(searchResults: SearchResults) {
    if (!searchResults) {
      return [];
    }
    this.notFoundMessage = 'No results found.';
    const searchAreaMap: { [key: string]: SearchResult[] } = {};
    for (const result of searchResults.results) {
      if (!result.title) { return; } // bad data; should fix
      const areaName = this.computeAreaName(result) || this.defaultArea;
      const area = searchAreaMap[areaName] = searchAreaMap[areaName] || [];
      area.push(result);
    }

    const keys = Object.keys(searchAreaMap).sort((l, r) => l > r ? 1 : -1);
    return keys.map(name => {
      const {priorityPages, pages, deprecated} = splitPages(searchAreaMap[name]);
      return {
        name,
        priorityPages,
        pages: pages.concat(deprecated),
      };
    });
  }

  private computeAreaName(result: SearchResult) {
    let navEntry = this.menu.getMenuSync(result.path, false);
    while (navEntry) {
      if (navEntry.entry.searchGroup) {
        return navEntry.entry.searchGroup;
      } else {
        navEntry = navEntry.parent;
      }
    }
  }
}

function splitPages(allPages: SearchResult[]) {
  const priorityPages: SearchResult[] = [];
  const pages: SearchResult[] = [];
  const deprecated: SearchResult[] = [];
  allPages.forEach(page => {
    if (page.deprecated) {
      deprecated.push(page);
    } else if (priorityPages.length < 5) {
      priorityPages.push(page);
    } else {
      pages.push(page);
    }
  });
  while (priorityPages.length < 5 && pages.length) {
    priorityPages.push(pages.shift()!);
  }
  while (priorityPages.length < 5 && deprecated.length) {
    priorityPages.push(deprecated.shift()!);
  }
  pages.sort(compareResults);

  return { priorityPages, pages, deprecated };
}

function compareResults(l: SearchResult, r: SearchResult) {
  return l.title.toUpperCase() > r.title.toUpperCase() ? 1 : -1;
}
