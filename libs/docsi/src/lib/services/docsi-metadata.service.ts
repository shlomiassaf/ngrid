import { Injectable } from '@angular/core';
import { DocsiMetadata, ApiReferenceMap } from '@neg/docsi/webpack';

const DOCSI_METADATA = require('/Users/shlomiassaf/Desktop/Code/shlomi/__LIB__/neg/docsi-client-metadata');

@Injectable({ providedIn: 'root' })
export class DocsiMetadataService implements DocsiMetadata {
  get ready(): Promise<DocsiMetadataService> {
    return this.fetching ? Promise.resolve(this.fetching).then( () => this ) : Promise.resolve(this);
  }

  extractCodeParts: { [key: string]: string };
  apiReference: {
    index: ApiReferenceMap;
  };

  constructor() {
    this.initMetadata();
  }
  private fetching //  = fetch(DOCSI_METADATA_FILE)
    // .then( response => response.json() )
    // .then( metadata => this.initMetadata(metadata) );

  private initMetadata(): void {
    this.fetching = undefined;
    this.extractCodeParts = DOCSI_METADATA.extractCodeParts;
    this.apiReference = DOCSI_METADATA.apiReference;
  }
};
