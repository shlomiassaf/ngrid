import { SourceCodeRef } from '@pebula/docsi/webpack';
import { Omit } from '../utils';

export interface ExtractedCodeQuery extends Partial<Omit<SourceCodeRef, 'code'>> { }

function matchCodeQuery(query: ExtractedCodeQuery, code: SourceCodeRef, keys?: Array<keyof ExtractedCodeQuery>): boolean {
  if (!keys) {
    keys = Object.keys(query) as any;
  }
  return keys.every( k => code[k] === query[k] );
}

function findCodeQuery(query: ExtractedCodeQuery, codeParts: SourceCodeRef[], keys?: Array<keyof ExtractedCodeQuery>): SourceCodeRef | undefined {
  if (!keys) {
    keys = Object.keys(query) as any;
  }
  for (const part of codeParts) {
    if (matchCodeQuery(query, part, keys)) {
      return part;
    }
  }
}

export class ExtractedCodeGroup {
  constructor(public code: SourceCodeRef[]) {}

  root(query: ExtractedCodeQuery): SourceCodeRef {
    return findCodeQuery(query, this.code);
  }

  filter(query: ExtractedCodeQuery[]): ExtractedCodeGroup {
    if (!Array.isArray(query) || query.length === 0) {
      throw new Error('Invalid CodeExtractSectionQuery');
    }

    const clone = this.clone();
    const queryKeys = [];
    clone.code = clone.code.filter( v => {
      for (let i in query) { // tslint:disable-line
        const keys = queryKeys[i] || (queryKeys[i] = Object.keys(query[i]));
        if (matchCodeQuery(query[i], v, keys)) {
          return true;
        }
      }
    });
    return clone;
  }

  clone(): ExtractedCodeGroup {
    const cloned = Object.create(this);
    cloned.code = this.code.slice();
    return cloned;
  }
}
