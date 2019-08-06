import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DynamicExportedObject } from '@pebula-internal/webpack-dynamic-module';
import { PageNavigationMetadata, PageFileAsset } from '@pebula-internal/webpack-markdown-pages';

/*  There is no package called `markdown-pages` in "node_modules"
    We optimistically expect it to exist in `InputFileSystem` of the webpack compiler.
    This is added by the webpack-dynamic-module plugin.
    SEE "libs-internal/webpack-dynamic-module/plugin.ts"
*/
const DYNAMIC_EXPORTED_OBJECT: DynamicExportedObject = require('markdown-pages');

@Injectable({ providedIn: 'root' })
export class MarkdownPagesService {
  markdownPages: PageNavigationMetadata;

  get ready(): Promise<MarkdownPagesService> {
    if (!this.markdownPages) {
      if (!this.fetching) {
        this.fetching = this.httpClient.get<PageNavigationMetadata>(DYNAMIC_EXPORTED_OBJECT.markdownPages).toPromise()
          .then( markdownPages => this.markdownPages = markdownPages );
      }
      return this.fetching.then( () => this);
    } else {
      return Promise.resolve(this);
    }
  }

  private fetching: Promise<any>;

  private _cache = new Map<string, PageFileAsset>();

  constructor(private httpClient: HttpClient) { }

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
