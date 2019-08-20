import { src } from 'gulp';
import { join } from 'path';

// These imports lack of type definitions.
const gulpSass = require('gulp-sass');
const nodeSass = require('node-sass');
const gulpIf = require('gulp-if');
const gulpCleanCss = require('gulp-clean-css');
const tildeImporter = require('node-sass-tilde-importer');

// Set the compiler to our version of `node-sass`, rather than the one that `gulp-sass` depends on.
gulpSass.compiler = nodeSass;

/** Create a gulp task that builds SCSS files. */
export function buildScssPipeline(
  sourceDir: string,
  sassIncludePaths: string[] = [],
  minifyOutput = false
) {
  return src(join(sourceDir, '**/!(test-).scss')).pipe(
    gulpSass({ importer: tildeImporter, includePaths: sassIncludePaths }).on(
      'error',
      gulpSass.logError
    ),
    gulpIf(minifyOutput, gulpCleanCss())
  );
}
