import { Injectable } from '@angular/core';
import { DocsiMetadata, ApiReferenceMap } from '@pebula/docsi/webpack';

/*  There is no package called `docsi-client-metadata` in "node_modules"
    We optimistically expect it to exist in `InputFileSystem` of the webpack compiler.
    This is added by the docsi metadata service plugin.
    SEE "libs/docsi/webpack/src/lib/docsi-webpack-plugins/metadata-file-emitter/plugin.ts"
*/
const DOCSI_METADATA = require('docsi-client-metadata');

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
