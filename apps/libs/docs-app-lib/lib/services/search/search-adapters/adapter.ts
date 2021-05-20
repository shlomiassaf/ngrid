import { Observable } from 'rxjs';
import { SearchResults } from '../models';

export interface SearchAdapter {
  loadIndex(searchContent: string): Observable<boolean>;

  queryIndex(query: string): Observable<SearchResults>;

  dispose(): void;
}
