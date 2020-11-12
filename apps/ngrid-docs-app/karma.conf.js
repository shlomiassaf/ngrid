// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const { join } = require('path');
const getBaseKarmaConfig = require('../../karma.conf');


/**
 * The demo/docs app is based on a metadata file which is dynamically generated when webpack builds.
 * This is a virtual files that collects all of the pages built with markdown and generate HTML for them which is
 * references in the metadata file to be downloaded upon page load.
 * This reference includes the HTML content and some other metadata like title, group, etc...
 *
 * The metadata file is loaded through the require statement: `require('markdown-pages')`.
 *
 * The original process has this setup in the webpack config, however, in karma we don't need it but we do need to
 * mock it or webpack will throw that it can't find the file `markdown-pages.js`
 *
 * This patch will add a plugin to the webpack config to mock that.
 */
const monkeyPatch = (karmaPlugins) => {
  const karmaPluginTuple = karmaPlugins[karmaPlugins.length - 1]['framework:@angular-devkit/build-angular'];
  const originalInitFn = karmaPluginTuple[1];  // karmaPluginTuple = ['factory', init];

  // wrap the original init function so we can hijack the webpackConfig and add our plugin
  const init = (config, ...args) => {
    const virtualModulePlugin = {
      apply: (compiler) => {
        compiler.hooks.afterEnvironment.tap('markdown-pages-mock', () => {
          compiler
            .inputFileSystem
            ._webpackCompilerHost
            .writeFile(join(process.cwd(), 'markdown-pages.js'), `module.exports = ${JSON.stringify({}, null, 2)};`);
        });
    },
    }
    config.buildWebpack.webpackConfig.plugins.unshift(virtualModulePlugin);

    // now run the original init function, passing the values.
    originalInitFn(config, ...args);
  };
  init.$inject = originalInitFn.$inject;

  karmaPluginTuple[1] = init;
}

module.exports = function(config) {
  const baseConfig = getBaseKarmaConfig();
  monkeyPatch(baseConfig.plugins);
  config.set({
    ...baseConfig,
    coverageIstanbulReporter: {
      ...baseConfig.coverageIstanbulReporter,
      dir: join(__dirname, '../../coverage/apps/ngrid-docs-app/')
    }
  });
};
