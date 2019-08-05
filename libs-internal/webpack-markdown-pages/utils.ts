import { ParsedPage, PageFileAsset, PageAssetNavEntry } from './models';

export function createPageFileAsset(parsedDoc: ParsedPage): string {
  const docFileAsset: PageFileAsset = {
    id: parsedDoc.attr.path,
    title: parsedDoc.attr.title,
    contents: parsedDoc.contents
  }
  return JSON.stringify(docFileAsset);
}

export function sortPageAssetNavEntry(entry: PageAssetNavEntry): void {
  _sortPageAssetNavEntry(entry, new Set<PageAssetNavEntry>());
}

function _sortPageAssetNavEntry(entry: PageAssetNavEntry, cache: Set<PageAssetNavEntry>): void {
  if (entry.children) {
    if (entry.children.length === 1) {
      _sortPageAssetNavEntry(entry.children[0], cache);
    } else {
      entry.children.sort( (c1, c2) => {
        let result: -1 | 0 | 1 = 0;
        if (c1.ordinal > c2.ordinal) {
          result = 1;
        } else if (c2.ordinal > c1.ordinal) {
          result = -1;
        }
        if (!cache.has(c1)) {
          cache.add(c1);
          _sortPageAssetNavEntry(c1, cache);
        }
        if (!cache.has(c2)) {
          cache.add(c2);
          _sortPageAssetNavEntry(c2, cache);
        }
        return result;
      });
    }
  }
}
