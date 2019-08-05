import { Injectable } from '@angular/core';
import { DynamicExportedObject } from '@pebula-internal/webpack-dynamic-module';
import { ExampleFileAsset } from '@pebula-internal/webpack-markdown-code-examples';

/*  There is no package called `markdown-pages` in "node_modules"
    We optimistically expect it to exist in `InputFileSystem` of the webpack compiler.
    This is added by the webpack-dynamic-module plugin.
    SEE "libs-internal/webpack-dynamic-module/plugin.ts"
*/
const DYNAMIC_EXPORTED_OBJECT: DynamicExportedObject = require('markdown-pages');

@Injectable({ providedIn: 'root' })
export class MarkdownCodeExamplesService {
  markdownCodeExamples: { [cmpSelector: string]: string };

  get ready(): Promise<MarkdownCodeExamplesService> {
    return this.fetching ? Promise.resolve(this.fetching).then( () => this ) : Promise.resolve(this);
  }

  private fetching = fetch(DYNAMIC_EXPORTED_OBJECT.markdownCodeExamples)
    .then( response => response.json() )
    .then( markdownCodeExamples => this.markdownCodeExamples = markdownCodeExamples );

  private _cache = new Map<string, ExampleFileAsset[]>();

  getExample(cmpSelector: string): Promise<ExampleFileAsset[]> {
    if (this._cache.has(cmpSelector)) {
      return Promise.resolve(this._cache.get(cmpSelector));
    }

    return this.ready
      .then( () => {
        const url = this.markdownCodeExamples[cmpSelector];
        if (url) {
          return fetch(url)
            .then( response => response.json() )
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
