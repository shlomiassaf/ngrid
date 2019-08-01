export interface PageAttributes {
  title: string;
  path: string;
  tooltip?: string;
  parent?: string;
  ordinal?: number;
  empty: boolean;
  type?: 'topMenuSection' | 'index' | 'singlePage';
  subType?: string;
  tags?: string;
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
  subType?: string;
  tags?: string[],
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
