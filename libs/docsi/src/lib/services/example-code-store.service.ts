import { Injectable } from '@angular/core';

import { SourceCodeRef } from '@pebula/docsi/webpack';
import { ExtractedCodeGroup } from '../models';
import { normalizeExtractCode } from '../utils';
import { DocsiMetadataService } from './docsi-metadata.service';

@Injectable({ providedIn: 'root' })
export class ExampleCodeStoreService {
  private _cache = new Map<string, ExtractedCodeGroup>();

  private constructor(private docsiMetadata: DocsiMetadataService) { }

  getPart(id: string): Promise<ExtractedCodeGroup> {
    if (this._cache.has(id)) {
      return Promise.resolve(this._cache.get(id));
    }

    return this.docsiMetadata.ready
      .then( () => {
        const url = this.docsiMetadata.extractCodeParts[id];
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
