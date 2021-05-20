import { Observable, of } from 'rxjs';
import { SearchResults } from '../models';
import { SearchAdapter } from './adapter';

export class WindowNoopSearchAdapter implements SearchAdapter {

  loadIndex(searchContent: string): Observable<boolean> {
    return of(true);
  };

  queryIndex(query: string): Observable<SearchResults> {
    return of({ query, results: [] });
  }

  dispose(): void { }
}

export default WindowNoopSearchAdapter;
