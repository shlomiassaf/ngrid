import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PageNavigationMetadata, PageFileAsset } from '@pebula-internal/webpack-markdown-pages';
import { ContentMapService } from './content-map.service';

@Injectable({ providedIn: 'root' })
export class MarkdownPagesService {
  markdownPages: PageNavigationMetadata;

  get ready(): Promise<MarkdownPagesService> {
    if (!this.markdownPages) {
      if (!this.fetching) {
        this.fetching = this.contentMapping.getMapping
          .then(({ markdownPages }) => this.httpClient.get<PageNavigationMetadata>(markdownPages).toPromise() )
          .then( markdownPages => this.markdownPages = markdownPages );
      }
      return this.fetching.then( () => this);
    } else {
      return Promise.resolve(this);
    }
  }

  private fetching: Promise<any>;

  private _cache = new Map<string, PageFileAsset>();

  constructor(private httpClient: HttpClient, private contentMapping: ContentMapService) { }

  getPage(path: string): Promise<PageFileAsset> {
    if (this._cache.has(path)) {
      return Promise.resolve(this._cache.get(path));
    }

    return this.ready
      .then( () => {
        const url = this.markdownPages.entryData[path];
        if (url) {
          return this.httpClient.get<PageFileAsset>(url).toPromise()
            .then( page => {
              this._cache.set(path, page);
              return page;
            });
        } else {
          const entry = this.markdownPages.entries[path];
          if (entry) {
            return { id: path, title: entry.title, contents: '' };
          }
          throw new Error(`Could not find a page ${path}`);
        }
      });
  }
}
