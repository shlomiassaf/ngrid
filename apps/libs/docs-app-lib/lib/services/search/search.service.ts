import { ConnectableObservable, Observable, ReplaySubject, race, timer } from 'rxjs';
import { concatMap, first, publishReplay, switchMap } from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';
import { ContentMapService } from '../content-map.service';
import { SearchResults } from './models';
import { SearchAdapter } from './search-adapters/adapter';
import WorkerSearchAdapter from './search-adapters/worker';
import WindowNoopSearchAdapter from './search-adapters/noop';

@Injectable({ providedIn: 'root' })
export class SearchService {
  ready: Observable<boolean>;

  readonly hasWorker: boolean;

  private searchesSubject = new ReplaySubject<string>(1);
  private adapter: SearchAdapter;

  constructor(private ngZone: NgZone, private contentMapping: ContentMapService) {
    this.hasWorker = typeof Worker !== 'undefined';

    if (this.hasWorker) {
      this.adapter = new WorkerSearchAdapter();
    } else {
      this.adapter = new WindowNoopSearchAdapter(); // new WindowSearchAdapter();
    }
  }

  loadIndex(initDelay: number = 2000): Observable<boolean> {
    const ready = this.ready = race<any>(
      timer(initDelay),
      this.searchesSubject.asObservable().pipe(first()),
    )
    .pipe(
      switchMap( x => this.contentMapping.getMapping ),
      concatMap(( {searchContent}) => this.adapter.loadIndex(searchContent) ),
      publishReplay(1),
    );

    // Connect to the observable to kick off the timer
    (ready as ConnectableObservable<boolean>).connect();
    return ready;
  };

  queryIndex(query: string): Observable<SearchResults> {
     // Trigger the searches subject to override the init delay timer
    this.searchesSubject.next(query);

    return new Observable<SearchResults>(subscriber => {
      this
        .ready
        .pipe( concatMap(() => this.adapter.queryIndex(query) ) )
        .subscribe({
          next: r => {
            if (!subscriber.closed) {
              this.ngZone.run(() => {
                subscriber.next(r);
                subscriber.complete();
              });
            }
          },
          error: e => {
            if (!subscriber.closed) {
              this.ngZone.run(() => subscriber.error(e));
            }
          },
        });

    });
  }

  dispose(): void { this.adapter.dispose(); }
}

// Required for type augmentation when WorkerSearchAdapter is replaced with WindowNoopSearchAdapter (server SSR build)
// When this happen, WorkerSearchAdapter is not loaded and so it will not load SearchEngine which triggers the augmentation loading.
import type { SearchableSource } from '@pebula-internal/webpack-markdown-app-search';
