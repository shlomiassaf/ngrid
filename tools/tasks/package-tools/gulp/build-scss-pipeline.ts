import { src } from 'gulp';
import { join } from 'path';

// These imports lack of type definitions.
const gulpIf = require('gulp-if');
const gulpCleanCss = require('gulp-clean-css');
const tildeImporter = require('node-sass-tilde-importer');

/* We don't need it, see comment blow... */
// Set the compiler to our version of `node-sass`, rather than the one that `gulp-sass` depends on.
// gulpSass.compiler = nodeSass;

/** Create a gulp task that builds SCSS files. */
export function buildScssPipeline(sourceDir: string,
                                  sassIncludePaths: string[] = [],
                                  minifyOutput = false) {

  /*  `gulp-sass` uses a hard reference to `node-sass` (require it), even if we override it.
      It also has a direct dependency to it, causing it to appear in the node_modules.
      This is not good because we want angular to use `sass` and not `node-sass`.
      For this, we have a post install script in package.json removing it post install (`node-sass`)
      However, this will fail `gulp-sass` since as said it will try to require it and fail.
      To workaround this one, we mock `node-sass` with `sass` directly, which also remove the need to explicitly set it as the compiler.

      TODO: Once `gulp-sass` has no direct reference, remove this patch.
   */
  const mock = require('mock-require');
  mock('node-sass', 'sass');
  const gulpSass = require('gulp-sass');

  return src(join(sourceDir, '**/!(test-).scss'))
    .pipe(
      gulpSass({ importer: tildeImporter, includePaths: sassIncludePaths }).on('error', gulpSass.logError),
      gulpIf(minifyOutput, gulpCleanCss()),
    );
}
