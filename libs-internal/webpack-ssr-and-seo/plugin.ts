import * as webpack from 'webpack';
import SitemapPlugin from 'sitemap-webpack-plugin';

const pluginName = 'ssr-and-seo-webpack-plugin';

export interface SsrAndSeoWebpackPluginOptions {
  /** When set will save output `PageNavigationMetadata` to this file */
  ssrPagesFilename?: string;
  /** When set will save sitemap  */
  sitemap?: {
    /** base is the root URL of your site (e.g. 'https://mysite.com') */
    basePath: string;
    /**  name of the output file,  default sitemap.xml */
    fileName?: string;

  };
}

export class SsrAndSeoWebpackPlugin implements webpack.Plugin {

  private options: SsrAndSeoWebpackPluginOptions;

  constructor(options: SsrAndSeoWebpackPluginOptions) {
    this.options = Object.assign({}, options);
  }

  apply(compiler: webpack.Compiler): void {
    compiler.hooks.markdownPageNavigationMetadataReady.tap(pluginName, (context) => {
      const { navMetadata, compilation } = context;

      const navEntriesSource = JSON.stringify(navMetadata);

      if (this.options.ssrPagesFilename) {
        compilation.assets[this.options.ssrPagesFilename] = {
          source: () => navEntriesSource,
          size: () => navEntriesSource.length
        };
      }

      if (this.options.sitemap) {
        const siteMapGen = new SitemapPlugin(this.options.sitemap.basePath, Object.keys(navMetadata.entryData));
        const sitemap = siteMapGen.generate();
        compilation.assets[this.options.sitemap.fileName || 'sitemap.xml'] = {
          source: () => sitemap,
          size: () => Buffer.byteLength(sitemap, 'utf8'),
        };
      }

    });
  }

}
