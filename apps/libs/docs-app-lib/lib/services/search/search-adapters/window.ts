import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SearchResults } from '../models';
import { SearchAdapter } from './adapter';

export class WindowSearchAdapter implements SearchAdapter {
  private searchEngine: import('../search-engine').SearchEngine;

  loadIndex(searchContent: string): Observable<boolean> {
    return from(import('../search-engine'))
      .pipe(
        switchMap((m) => {
          this.searchEngine = new m.SearchEngine(searchContent);
          return this.searchEngine.loadIndex();
        })
      );
  };

  queryIndex(query: string): Observable<SearchResults> { return of({ query, results: this.searchEngine.queryIndex(query) }); }

  dispose(): void { }
}

export default WindowSearchAdapter;
