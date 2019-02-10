import * as Path from 'path';
import { Configuration } from 'webpack';
import { DocsiMetadataFileEmitterWebpackPlugin, DocsiSourceCodeRefWebpackPlugin } from '@pebula/docsi/webpack';
import { ServiceWorkerTsPlugin } from '../../tools/service-worker-ts-plugin';

const SERVICE_WORKER_HTTP_SERVER_REGEXP = /.+service-worker\.ts$/;

const LIB_APPS_FOLDER = 'apps/table';
const APP_FOLDER = 'table-demo-app';

function excludeFromTsLoader(loaders, ...regexp) {
  const tsLoaderRules = loaders.filter( l => l.test.test('someFile.ts') );
  if (tsLoaderRules.length === 0) {
    throw new Error('Could not find TS loader RULE and add exclude to it');
  }

  for (const tsLoaderRule of tsLoaderRules) {
    if (!tsLoaderRule.exclude) {
      tsLoaderRule.exclude = [];
    }
    tsLoaderRule.exclude.push(...regexp);
  }
}

function applyLoaders(webpackConfig: Configuration) {
  /*  Service worker app
      The DEMO app comes with an internal service worker app.
      The service worker files requires a separate compilation, outside of the main compilation.
      This compilation also requires a different TS compiler instance, so it is compiled by ts-loader and not AngularCompilerPlugin
  */

  // We first exclude the TS files from the current TS loader so they are NOT processed by the angular compiler plugin.
  excludeFromTsLoader(webpackConfig.module.rules, SERVICE_WORKER_HTTP_SERVER_REGEXP);

  // We have custom loaders, for webpack to be aware of them we tell it the directory the are in.
  // make sure that each folder behaves like a node module, that is it has an index file inside root or a package.json pointing to it.
  // the default lib generation of nx and angular/cli does not do that.
  webpackConfig.resolveLoader.modules.push('libs');


  // We push new loader rules to handle the scenarios
  // we also add a loader to handle markdown files.
  webpackConfig.module.rules.push(
    {
      test: SERVICE_WORKER_HTTP_SERVER_REGEXP,
      use: [
        {
          loader: 'ts-loader',
          options: {
            context: process.cwd(),
            transpileOnly: true,
            configFile: `apps/${APP_FOLDER}/tsconfig.server.service-worker.json`,
          }
        }
      ]
    },
    {
      test: [ /\.html$/ ],
      include: [ new RegExp(`/${LIB_APPS_FOLDER}/`) ],
      exclude: [ new RegExp(`/${LIB_APPS_FOLDER}/shared/`) ],
      use: [
        {
          loader: "docsi/webpack",
          options: {
            highlight: 'prismjs',
          }
        }
      ]
    },
  );
}


function updateWebpackConfig(webpackConfig: Configuration): Configuration {
  applyLoaders(webpackConfig);

  const plugins = ServiceWorkerTsPlugin.create(
    {
      tsconfig: Path.join(__dirname, 'tsconfig.server.service-worker.json')
    },
    {
      entry: Path.join(process.cwd(), `libs/${LIB_APPS_FOLDER}/shared/src/lib/datastore/datasource.store-service-worker.ts`)
    }
  );
  // push the new plugin AFTER the angular compiler plugin
  const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
  const idx = webpackConfig.plugins.findIndex( p => p instanceof AngularCompilerPlugin );
  webpackConfig.plugins.splice(idx + 1, 0, ...plugins);

  (webpackConfig.plugins[idx] as any)._options.directTemplateLoading = false;

  webpackConfig.plugins.push(new DocsiMetadataFileEmitterWebpackPlugin());
  webpackConfig.plugins.push(new DocsiSourceCodeRefWebpackPlugin());

  return webpackConfig;
}

module.exports = updateWebpackConfig;
