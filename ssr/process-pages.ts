import { join } from 'path';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { mkdirpSync } from 'fs-extra';
import { PageAssetNavEntry, PageNavigationMetadata } from '@pebula-internal/webpack-markdown-pages/models';

const fetch = require('node-fetch').default;

export interface ProcessPagesContext {
  baseUrl: string;
  distFolder: string;
  ssrPagesFilename: string;
}

export async function processPages(context: ProcessPagesContext) {
  const ssrPages: PageNavigationMetadata = JSON.parse(readFileSync(join(context.distFolder, context.ssrPagesFilename), { encoding: 'utf-8' }));
  await createStaticPages(ssrPages, context);
}

async function createStaticPages(ssrPages: PageNavigationMetadata, context: ProcessPagesContext) {
  const pages = Object.values(ssrPages.entries);
  const hasPage = (entry: PageAssetNavEntry) => entry.path in ssrPages.entryData;

  const processEntry = async (entry: PageAssetNavEntry) => {
    if (hasPage(entry)) {
      try {
        const dirPath = join(context.distFolder, entry.path);

        if (!existsSync(dirPath)) {
          mkdirpSync(dirPath);
        }

        let pathname = entry.path === '/' ? '' : entry.path || '';
        if (pathname[0] === '/') {
          pathname = pathname.substr(1);
        }
        pathname = '/' + pathname;

        const url = `${context.baseUrl}${pathname}`;
        console.log(`Fetching ${url}`);
        const fetchResult = await fetch(url);
        const staticHtml = await fetchResult.text();

        const destPath = join(dirPath, 'index.html');
        console.log(`Writing ${destPath}`);
        writeFileSync(destPath, staticHtml, { encoding: 'utf-8' });
      } catch( err ) {

      }
    }

    if (entry.children) {
      for (const childEntry of entry.children) {
        await processEntry(childEntry);
      }
    }
  }

  let indexEntry: PageAssetNavEntry;
  for (const entry of pages) {
    if (entry.type === 'index') {
      indexEntry = entry;
    } else {
      await processEntry(entry);
    }
  }

  if (indexEntry) {
    await processEntry(indexEntry);
  }
}
