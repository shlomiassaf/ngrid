import * as Path from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import { DocsiMetadataFileEmitterWebpackPlugin, DocsiSourceCodeRefWebpackPlugin } from '@pebula-internal/docsi/webpack';

// ** CONFIG VALUES **
const MAIN_APP_LIBRARY_NAME = 'apps/libs/ngrid';
const HTML_MARKDOWN_TRANSFORM_LOADER_INCLUDE = [
  new RegExp(`/${MAIN_APP_LIBRARY_NAME}/`),
  new RegExp(`/apps/libs/ngrid-material/`),
];
const HTML_MARKDOWN_TRANSFORM_LOADER_EXCLUDE = [ new RegExp(`/${MAIN_APP_LIBRARY_NAME}/shared/`) ]

function applyLoaders(webpackConfig: Configuration) {
  // We have custom loaders, for webpack to be aware of them we tell it the directory the are in.
  // make sure that each folder behaves like a node module, that is it has an index file inside root or a package.json pointing to it.
  // the default lib generation of nx and angular/cli does not do that.
  webpackConfig.resolveLoader.modules.push('libs-internal');


  // We push new loader rules to handle the scenarios
  // we also add a loader to handle markdown files.
  webpackConfig.module.rules.push(
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


  // push the new plugin AFTER the angular compiler plugin
  const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
  const idx = webpackConfig.plugins.findIndex( p => p instanceof AngularCompilerPlugin );

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
