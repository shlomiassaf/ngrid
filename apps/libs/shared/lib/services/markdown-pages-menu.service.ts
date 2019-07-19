import { Injectable } from '@angular/core';
import { PageNavigationMetadata, PageAssetNavEntry } from '@pebula-internal/webpack-markdown-pages';

import { MarkdownPagesService } from './markdown-pages.service';

@Injectable({ providedIn: 'root' })
export class MarkdownPagesMenuService {

  get ready(): Promise<MarkdownPagesMenuService> { return this.mdPages.ready.then( () => { return this; }); }

  private _cache = new Map<string, NavEntry>();
  private _ofTypeCache = new Map<PageAssetNavEntry['type'], PageAssetNavEntry[]>();

  constructor(private mdPages: MarkdownPagesService) { }

  ofType(type: PageAssetNavEntry['type']): Promise<PageAssetNavEntry[]> {
    if (this._ofTypeCache.has(type)) {
      return Promise.resolve(this._ofTypeCache.get(type));
    }

    return this.mdPages.ready
      .then( () => {
        const result: PageAssetNavEntry[] = [];
        for (const key of Object.keys(this.mdPages.markdownPages.entries)) {
          const entry = this.mdPages.markdownPages.entries[key];
          if (entry.type === type) {
            result.push(entry);
          }
        }
        this._ofTypeCache.set(type, result);
        return result;
      });
  }

  getMenu(entry: string): Promise<NavEntry> {
    return this.mdPages.ready
      .then( () => {
        if (this._cache.has(entry)) {
          return this._cache.get(entry);
        }

        const pageEntry = this.mdPages.markdownPages.entries[entry];
        if (!pageEntry) {
          throw new Error(`No entry found for markdown menu ${entry}`);
        }

        const localPageEntry = processPageAssetNavEntry(pageEntry, this.mdPages.markdownPages);
        this._cache.set(entry, localPageEntry);

        return localPageEntry;
      });
  }
}


export interface NavEntry {
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
  }

  if (entry.children) {
    e.children = entry.children.map( child => processPageAssetNavEntry(child, meta, e));
  }

  return e;
}
