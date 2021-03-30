import { Injectable } from '@angular/core';
import type { PageNavigationMetadata, PageAssetNavEntry } from '@pebula-internal/webpack-markdown-pages';

import { MarkdownPagesService } from './markdown-pages.service';

@Injectable({ providedIn: 'root' })
export class MarkdownPagesMenuService {

  get ready(): Promise<MarkdownPagesMenuService> {
    return this.mdPages.ready.then( () => {
      const rootKeys = Object.keys(this.mdPages.markdownPages.entries);
      for (const key of rootKeys) {
        this.getMenuSync(key);
      }
      return this;
     });
  }

  private _cache = new Map<string, NavEntry>();
  private _ofTypeCache = new Map<PageAssetNavEntry['type'], PageAssetNavEntry[]>();

  constructor(private mdPages: MarkdownPagesService) {
  }

  ofType(type: PageAssetNavEntry['type']): Promise<PageAssetNavEntry[]> {
    if (this._ofTypeCache.has(type)) {
      return Promise.resolve(this._ofTypeCache.get(type));
    }

    return this.ready
      .then( () => {
        const result: PageAssetNavEntry[] = [];
        for (const key of Object.keys(this.mdPages.markdownPages.entries)) {
          const entry = this.mdPages.markdownPages.entries[key];
          if (entry.type === type) {
            result.push(entry);
          }
        }
        this._ofTypeCache.set(type, result);

        // Although the entries come sorted from the server, because it's an object and we use `Object.keys`
        // we need to re-sort it.
        result.sort( (entry1, entry2) => {
          if (entry1.ordinal > entry2.ordinal) {
            return 1;
          } else if (entry2.ordinal > entry1.ordinal) {
            return -1;
          } else {
            return 0;
          }
        });
        return result;
      });
  }

  getMenu(entry: string): Promise<NavEntry> {
    return this.mdPages.ready
      .then( () => this.getMenuSync(entry) );
  }

  getMenuSync(entry: string, throwOnMissing = true): NavEntry | undefined {
    if (!this.mdPages.markdownPages) {
      throw new Error('Service is not ready.');
    }

    if (this._cache.has(entry)) {
      return this._cache.get(entry);
    }

    const pageEntry = this.mdPages.markdownPages.entries[entry];
    if (!pageEntry) {
      if (throwOnMissing) {
        throw new Error(`No entry found for markdown menu ${entry}`);
      } else {
        return;
      }
    }

    const localPageEntry = processPageAssetNavEntry(pageEntry, this.mdPages.markdownPages);
    this.cacheEntry(localPageEntry);

    return localPageEntry;
  }

  private cacheEntry(entry: NavEntry): void {
    this._cache.set(entry.path, entry);
    if (entry.children) {
      for (const child of entry.children) {
        this.cacheEntry(child);
      }
    }
  }
}


export interface NavEntry {
  entry: PageAssetNavEntry;
  title: string;
  path: string;
  tooltip?: string;
  dataPath?: string;
  parent?: NavEntry;
  children?: NavEntry[];
}

function processPageAssetNavEntry(entry: PageAssetNavEntry, meta: PageNavigationMetadata, parent: NavEntry = null) {
  const e: NavEntry = {
    title: entry.title,
    path: entry.path,
    tooltip: entry.tooltip,
    dataPath: meta.entryData[entry.path],
    parent,
    entry,
  }

  if (entry.children) {
    e.children = entry.children.map( child => processPageAssetNavEntry(child, meta, e));
  }

  return e;
}
