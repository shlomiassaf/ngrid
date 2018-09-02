import { Configuration } from 'webpack';
import { DocsiMetadataFileEmitterWebpackPlugin, DocsiSourceCodeRefWebpackPlugin, DocsiApiReferenceWebpackPlugin } from '@sac/docsi/webpack';

function applyLoaders(webpackConfig: Configuration) {
  // We have custom loaders, for webpack to be aware of them we tell it the directory the are in.
  // make sure that each folder behaves like a node module, that is it has an index file inside root or a package.json pointing to it.
  // the default lib generation of nx and angular/cli does not do that.
  webpackConfig.resolveLoader.modules.push('libs');

  // We push new loader rules to handle the scenarios
  // we also add a loader to handle markdown files.
  webpackConfig.module.rules.push(
    {
      test: /\.html$/,
      include: [ /\/demo-apps\// ],
      exclude: [ /\/demo-apps\/shared\// ],
      use: [
        {
          loader: "docsi/webpack",
          options: { }
        }
      ]
    },
  );
}


function updateWebpackConfig(webpackConfig: Configuration): Configuration {
  applyLoaders(webpackConfig);

  webpackConfig.plugins.push(new DocsiMetadataFileEmitterWebpackPlugin());
  webpackConfig.plugins.push(new DocsiSourceCodeRefWebpackPlugin());
  webpackConfig.plugins.push(new DocsiApiReferenceWebpackPlugin({
    mode: 'mono-repo',
    entryPoints: [
      require.resolve('@sac/table'),
      require.resolve('@sac/table/block-ui'),
      require.resolve('@sac/table/detail-row'),
      require.resolve('@sac/table/mat-checkbox-column'),
      require.resolve('@sac/table/mat-paginator'),
      require.resolve('@sac/table/mat-sort'),
      require.resolve('@sac/table/sticky'),
    ],
    tsconfig: './libs/tsconfig.docsi-api-ref.json',
  }));

  return webpackConfig;
}

module.exports = updateWebpackConfig;
