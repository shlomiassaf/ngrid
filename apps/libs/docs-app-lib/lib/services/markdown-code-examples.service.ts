import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { ExampleFileAsset } from '@pebula-internal/webpack-markdown-code-examples';
import { ContentMapService } from './content-map.service';

@Injectable({ providedIn: 'root' })
export class MarkdownCodeExamplesService {
  markdownCodeExamples: { [cmpSelector: string]: string };

  get ready(): Promise<MarkdownCodeExamplesService> {
    if (!this.markdownCodeExamples) {
      if (!this.fetching) {
        this.fetching = this.contentMapping.getMapping
          .then(({ markdownCodeExamples }) => this.httpClient.get<{ [cmpSelector: string]: string }>(markdownCodeExamples).toPromise() )
          .then( markdownCodeExamples => this.markdownCodeExamples = markdownCodeExamples );
      }
      return this.fetching.then( () => this);
    } else {
      return Promise.resolve(this);
    }
  }

  private fetching: Promise<any>;

  private _cache = new Map<string, ExampleFileAsset[]>();

  constructor(private httpClient: HttpClient, private contentMapping: ContentMapService) { }

  getExample(cmpSelector: string): Promise<ExampleFileAsset[]> {
    if (this._cache.has(cmpSelector)) {
      return Promise.resolve(this._cache.get(cmpSelector));
    }

    return this.ready
      .then( () => {
        const url = this.markdownCodeExamples[cmpSelector];
        if (url) {
          return this.httpClient.get<ExampleFileAsset[]>(url).toPromise()
            .then( page => {
              this._cache.set(cmpSelector, page);
              return page;
            });
        } else {
          throw new Error(`Could not find an example for selector ${cmpSelector}`);
        }
      });
  }
}
