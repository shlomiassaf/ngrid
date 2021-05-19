import * as webpack from 'webpack';
import SitemapPlugin from 'sitemap-webpack-plugin';
import { MarkdownPagesWebpackPlugin } from '../webpack-markdown-pages/plugin';

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

export class SsrAndSeoWebpackPlugin {

  private options: SsrAndSeoWebpackPluginOptions;

  constructor(options: SsrAndSeoWebpackPluginOptions) {
    this.options = Object.assign({}, options);
  }

  apply(compiler: webpack.Compiler): void {
    MarkdownPagesWebpackPlugin.getCompilationHooks(compiler).markdownPageNavigationMetadataReady.tap(pluginName, (context) => {
      const { navMetadata, compilation } = context;

      const navEntriesSource = JSON.stringify(navMetadata);

      if (this.options.ssrPagesFilename) {
        compilation.assets[this.options.ssrPagesFilename] = new webpack.sources.RawSource(navEntriesSource);
      }

      if (this.options.sitemap) {
        const siteMapGen = new SitemapPlugin(this.options.sitemap.basePath, Object.keys(navMetadata.entryData));
        const sitemap = siteMapGen.generate();
        compilation.assets[this.options.sitemap.fileName || 'sitemap.xml'] = new webpack.sources.RawSource(sitemap);
      }

    });
  }

}
