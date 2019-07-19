export interface PageAttributes {
  title: string;
  path: string;
  tooltip?: string;
  parent?: string;
  ordinal?: number;
  empty: boolean;
  type?: 'topMenuSection' | 'index';
}

export interface ParsedPage {
  file: string;
  fullPath: string;
  source: string;
  contents: string;
  attr: PageAttributes;
  forceRender?: boolean;
  postRenderMetadata?: {
    navEntry: PageAssetNavEntry;
    outputAssetPath: string;
  }
}

export interface PageFileAsset {
  id: string;
  title: string;
  contents: string;
}

export interface PageAssetNavEntry {
  title: string;
  path: string;
  type?: PageAttributes['type'];
  tooltip?: string;
  ordinal?: number;
  children?: PageAssetNavEntry[];
}

export interface PageNavigationMetadata {
  entries: {
    [index: string]: PageAssetNavEntry
  };
  entryData: {
    [path: string]: string;
  };
}
