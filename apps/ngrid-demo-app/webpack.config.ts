import * as Path from 'path';
import { Compiler, Configuration, DefinePlugin } from 'webpack';
import * as simplegit from 'simple-git/promise';

import { PebulaDynamicModuleWebpackPlugin } from '@pebula-internal/webpack-dynamic-module';
import { MarkdownPagesWebpackPlugin } from '@pebula-internal/webpack-markdown-pages';
import { MarkdownCodeExamplesWebpackPlugin } from '@pebula-internal/webpack-markdown-code-examples';
import * as remarkPlugins from './build/remark';

// ** CONFIG VALUES **
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

  const remarkSlug = require('remark-slug')
  const remarkAutolinkHeadings = require('@rigor789/remark-autolink-headings');
  const remarkAttr = require('remark-attr')
  const customBlockquotesOptions = { mapping: {
    'i>': 'info',
    'I>': 'info icon',
    'w>': 'warn',
    'W>': 'warn icon',
    'e>': 'error',
    'E>': 'error icon',
  }};

  const dynamicModule = new PebulaDynamicModuleWebpackPlugin(Path.join(process.cwd(), 'markdown-pages.js'));
  webpackConfig.plugins.push(dynamicModule);
  webpackConfig.plugins.push(new MarkdownPagesWebpackPlugin({
    docsPath: 'content/**/*.md',
    ssrPagesFilename: 'ssr-pages.json',
    remarkPlugins: [
      remarkSlug,
      remarkAutolinkHeadings,
      [remarkAttr, { scope: 'permissive' }],
      remarkPlugins.gatsbyRemarkPrismJs(),
      [remarkPlugins.customBlockquotes, customBlockquotesOptions],
    ],
  }));
  webpackConfig.plugins.push(new MarkdownCodeExamplesWebpackPlugin({
    docsPath: '../libs/ngrid-examples/**/*.ts',
  }));

  const angular = require('@angular/core/package.json');
  const ngrid = require(Path.join(process.cwd(), `libs/ngrid/package.json`));
  const fn = async () => {
    const format =  {
      short_hash: '%h',
      hash: '%H',
      date: '%ai',
      message: '%s',
      refs: '%D',
      body: '%b',
      author_name: '%aN',
      author_email: '%ae'
    };
    const gitInfo = await simplegit().log({ n: "1", format});
    return {
      ANGULAR_VERSION: JSON.stringify(angular.version),
      NGRID_VERSION: JSON.stringify(ngrid.version),
      BUILD_VERSION: JSON.stringify(gitInfo.latest.short_hash),
    };

  };

  const definePlugin = new AsyncDefinePlugin(fn);
  webpackConfig.plugins.push(definePlugin);

  return webpackConfig;
}

module.exports = updateWebpackConfig;

export class AsyncDefinePlugin {
  constructor(private asyncDef: () => Promise<any>) { }

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise('AsyncDefinePlugin', async () => {
      const definitions = await this.asyncDef();
      const definePlugin = new DefinePlugin(definitions);
      definePlugin.apply(compiler);
    });
  }
}
