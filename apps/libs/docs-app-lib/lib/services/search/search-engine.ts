import * as lunr from 'lunr';
import type { SearchableSource } from '@pebula-internal/webpack-markdown-app-search';
import { SearchResult } from './models';

export class SearchEngine {
  private pages = new Map<string, any>();
  private index: any;

  private _ready?: Promise<boolean>;

  constructor(private searchMetaUrl: string) { }

  loadIndex(): Promise<boolean> {
    if (this.index) {
      return Promise.resolve(true);
    } else if (this._ready) {
      return this._ready;
    } else {
      this._ready = new Promise<boolean>( (resolve, reject) => {
        makeRequest(this.searchMetaUrl, searchInfo => {
          this.index = createIndex(loadIndex(searchInfo, this.pages));
          this._ready = undefined;
          resolve(true);
        });
      });
      return this._ready;
    }
  }

  queryIndex(query: string): SearchResult[] {
    try {
      if (query.length) {
        var results = this.index.search(query);
        if (results.length === 0) {
          // Add a relaxed search in the title for the first word in the query
          // E.g. if the search is "ngCont guide" then we search for "ngCont guide titleWords:ngCont*"
          var titleQuery = 'titleWords:*' + query.split(' ', 1)[0] + '*';
          results = this.index.search(query + ' ' + titleQuery);
        }
        // Map the hits into info about each page to be returned as results
        return results.map( hit => this.pages.get(hit.ref) );
      }
    } catch(e) {
      // If the search query cannot be parsed the index throws an error
      // Log it and recover
      console.log(e);
    }
    return [];
  }
}

// Create the lunr index - the docs should be an array of objects, each object containing
// the path and search terms for a page
function createIndex(addFn) {
  lunr.QueryLexer.termSeparator = lunr.tokenizer.separator = /\s+/;
  return lunr(function() {
    this.ref('path');
    this.field('titleWords', {boost: 10});
    this.field('headingWords', {boost: 5});
    this.field('keywords', {boost: 2});
    addFn(this);
  });
}

// Create the search index from the searchInfo which contains the information about each page to be indexed
function loadIndex(searchInfo: SearchableSource[], pages: Map<string, any>) {
  return index => {
    // Store the pages data to be used in mapping query results back to pages
    // Add search terms from each page to the search index
    searchInfo.forEach(page => {
      index.add(page);
      pages.set(page.path, page);
    });
  };
}

// Use XHR to make a request to the server
function makeRequest(url, callback) {

  // The JSON file that is loaded should be an array of PageInfo:
  var searchDataRequest = new XMLHttpRequest();
  searchDataRequest.onload = function() {
    callback(JSON.parse(this.responseText));
  };
  searchDataRequest.open('GET', url);
  searchDataRequest.send();
}
