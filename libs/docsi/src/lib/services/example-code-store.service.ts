import { Injectable } from '@angular/core';

import { SourceCodeRef } from '@sac/docsi/webpack';
import { ExtractedCodeGroup } from '../models';
import { normalizeExtractCode } from '../utils';

@Injectable({ providedIn: 'root' })
export class ExampleCodeStoreService {
  private get index() { return Promise.resolve(this._index); }
  private _index: any;
  private _cache = new Map<string, ExtractedCodeGroup>();

  private constructor() {
    this._index = fetch('extracted-code-index.json')
      .then( response => response.json() )
      .then( index => this._index = index );
  }

  getPart(id: string): Promise<ExtractedCodeGroup> {
    if (this._cache.has(id)) {
      return Promise.resolve(this._cache.get(id));
    }

    return this.index
      .then( index => {
        const url = index && index[id];
        if (url) {
          return fetch(url).then( response => response.json() ).then(normalizeExtractCode);
        } else {
          throw new Error(`Could not find a code part with id ${id}`);
        }
      })
      .then( (extracted: SourceCodeRef[]) => {
          const compiledCode = new ExtractedCodeGroup(extracted);
          this._cache.set(id, compiledCode)
          return compiledCode;
      });
  }
};
