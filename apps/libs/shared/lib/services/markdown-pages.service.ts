import { Injectable } from '@angular/core';
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
    return this.fetching ? Promise.resolve(this.fetching).then( () => this ) : Promise.resolve(this);
  }

  private fetching = fetch(DYNAMIC_EXPORTED_OBJECT.markdownPages)
    .then( response => response.json() )
    .then( markdownPages => this.markdownPages = markdownPages );

  private _cache = new Map<string, PageFileAsset>();


  getPage(path: string): Promise<PageFileAsset> {
    if (this._cache.has(path)) {
      return Promise.resolve(this._cache.get(path));
    }

    return this.ready
      .then( () => {
        const url = this.markdownPages.entryData[path];
        if (url) {
          return fetch(url)
            .then( response => response.json() )
            .then( page => {
              this._cache.set(path, page);
              return page;
            });
        } else {
          throw new Error(`Could not find a page ${path}`);
        }
      });
  }
}
