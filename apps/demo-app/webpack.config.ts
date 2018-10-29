import { Configuration } from 'webpack';
import { DocsiMetadataFileEmitterWebpackPlugin, DocsiSourceCodeRefWebpackPlugin, DocsiApiReferenceWebpackPlugin } from '@neg/docsi/webpack';

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
  // webpackConfig.plugins.push(new DocsiApiReferenceWebpackPlugin({
  //   mode: 'mono-repo',
  //   entryPoints: [
  //     require.resolve('@neg/table'),
  //     require.resolve('@neg/table/block-ui'),
  //     require.resolve('@neg/table/detail-row'),
  //     require.resolve('@neg/table/mat-checkbox-column'),
  //     require.resolve('@neg/table/mat-paginator'),
  //     require.resolve('@neg/table/mat-sort'),
  //     require.resolve('@neg/table/sticky'),
  //   ],
  //   tsconfig: './libs/tsconfig.docsi-api-ref.json',
  // }));

  return webpackConfig;
}

module.exports = updateWebpackConfig;
