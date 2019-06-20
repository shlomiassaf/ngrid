import * as FS from 'fs';
import * as Path from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import { DocsiMetadataFileEmitterWebpackPlugin, DocsiSourceCodeRefWebpackPlugin } from '@pebula/docsi/webpack';
import { ServiceWorkerTsPlugin } from '../../tools/service-worker-ts-plugin';

// ** CONFIG VALUES **
const SERVICE_WORKER_HTTP_SERVER_REGEXP = /.+service-worker\.ts$/;
const MAIN_APP_LIBRARY_NAME = 'apps/ngrid';
const HTML_MARKDOWN_TRANSFORM_LOADER_INCLUDE = [
  new RegExp(`/${MAIN_APP_LIBRARY_NAME}/`),
  new RegExp(`/apps/ngrid-material/`),
];
const HTML_MARKDOWN_TRANSFORM_LOADER_EXCLUDE = [ new RegExp(`/${MAIN_APP_LIBRARY_NAME}/shared/`) ]
const SERVICE_WORKER_ENTRY_FILE = Path.join(process.cwd(), `libs/apps/ngrid/shared/src/lib/datastore/datasource.store-service-worker.ts`)
const SERVICE_WORKER_TSCONFIG_FILE = `apps/ngrid-demo-app/tsconfig.server.service-worker.json`;

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
            configFile: SERVICE_WORKER_TSCONFIG_FILE,
          }
        }
      ]
    },
    {
      test: [ /\.html$/ ],
      rules: [
        {
          use: [
            'html-loader',
          ]
        },
        {
          include: HTML_MARKDOWN_TRANSFORM_LOADER_INCLUDE,
          exclude: HTML_MARKDOWN_TRANSFORM_LOADER_EXCLUDE,
          use: [
            {
              loader: "docsi/webpack",
              options: {
                highlight: 'prismjs',
              }
            }
          ]
        },
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
      entry: SERVICE_WORKER_ENTRY_FILE,
    }
  );
  // push the new plugin AFTER the angular compiler plugin
  const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
  const idx = webpackConfig.plugins.findIndex( p => p instanceof AngularCompilerPlugin );
  webpackConfig.plugins.splice(idx + 1, 0, ...plugins);

  const oldOptions = (webpackConfig.plugins[idx] as any)._options;
  oldOptions.directTemplateLoading = false;
  webpackConfig.plugins[idx] = new AngularCompilerPlugin(oldOptions);

  webpackConfig.plugins.push(new DocsiMetadataFileEmitterWebpackPlugin());
  webpackConfig.plugins.push(new DocsiSourceCodeRefWebpackPlugin());

  const angular = require('@angular/core/package.json');
  const ngrid = require(Path.join(process.cwd(), `libs/ngrid/package.json`));
  const definePlugin = new DefinePlugin({
    ANGULAR_VERSION: JSON.stringify(angular.version),
    NGRID_VERSION: JSON.stringify(ngrid.version),
  });
  webpackConfig.plugins.push(definePlugin);

  return webpackConfig;
}

module.exports = updateWebpackConfig;
