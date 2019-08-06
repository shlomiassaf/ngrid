// working around:
// https://github.com/angular/components/blob/461d5390d95732544db506fb6c6536f3a5803065/src/cdk-experimental/popover-edit/polyfill.ts#L40
if (typeof global.Element === 'undefined') {
  global.Element = class {};
}

if (typeof global.requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = fn => {
    setTimeout(fn, 16);
  }
}

/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */

import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { mkdirpSync } from 'fs-extra';
import { PageAssetNavEntry } from '@pebula-internal/webpack-markdown-pages/models';

// Express server
const app = express();

const PORT = process.env.PORT || 4001;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');
const DIST_SERVER_FOLDER = join(process.cwd(), 'dist/server');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap } = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));
app.get('*.*', express.static(DIST_SERVER_FOLDER));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);

  const pages: { [index: string]: PageAssetNavEntry } = JSON.parse(readFileSync(join(DIST_FOLDER, 'pages.json'), { encoding: 'utf-8' }));
  createStaticPages(Object.values(pages));
});

async function createStaticPages(pages: PageAssetNavEntry[]) {
  const fetch = require('node-fetch').default;

  console.log('Pre-rendering app...');

  const processEntry = async (entry: PageAssetNavEntry) => {
    try {
      const dirPath = join(DIST_FOLDER, 'content', entry.path);

      if (!existsSync(dirPath)) {
        mkdirpSync(dirPath);
      }

      let pathname = entry.path === '/' ? '' : entry.path || '';
      if (pathname[0] === '/') {
        pathname = pathname.substr(1);
      }
      pathname = '/content/' + pathname;

      console.log(`Fetching ${`http://localhost:${PORT}${pathname}`}`);
      const fetchResult = await fetch(`http://localhost:${PORT}${pathname}`);
      const staticHtml = await fetchResult.text();

      if (!existsSync(join(dirPath, 'index.html'))) {
        console.log(`Writing ${join(dirPath, 'index.html')}`);
        writeFileSync(join(dirPath, 'index.html'), staticHtml, { encoding: 'utf-8' });
      }
    } catch( err ) {
    }
    if (entry.children) {
      for (const childEntry of entry.children) {
        await processEntry(childEntry);
      }
    }
  }

  for (const entry of pages) {
    await processEntry(entry);
  }

  console.log('Done!');
}
