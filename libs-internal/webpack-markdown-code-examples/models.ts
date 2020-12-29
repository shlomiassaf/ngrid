export interface ParsedComponentMetadata {
  selector: string;
  component: string;
  templateUrl: string;
  styleUrls: string[];
}

export interface ParsedPrimaryComponentMetadata extends ParsedComponentMetadata {
  example: {
    title: string;
    additionalFiles?: string[];
  };
  secondaries: ParsedComponentMetadata[];
}

export interface ExampleFileAsset {
  parent: string;
  file: string;
  title: string;
  lang: string;
  source: string;
  contents: string;
}

export interface ParsedExampleMetadata {
  /** An id used to retrieve from the cache */
  cacheId: string;
  /** The root path of the module containing the primary component */
  root: string;
  /** The primary selector */
  selector: string;

  assets: ExampleFileAsset[];
  pathAssets: Map<string, ExampleFileAsset>;
  forceRender?: boolean;
  postRenderMetadata?: {
    outputAssetPath: string;
  }
}
