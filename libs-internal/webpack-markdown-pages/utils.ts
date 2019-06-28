import { ParsedPage, PageFileAsset } from './models';

export function createPageFileAsset(parsedDoc: ParsedPage): string {
  const docFileAsset: PageFileAsset = {
    id: parsedDoc.attr.path,
    title: parsedDoc.attr.title,
    contents: parsedDoc.contents
  }
  return JSON.stringify(docFileAsset);
}
