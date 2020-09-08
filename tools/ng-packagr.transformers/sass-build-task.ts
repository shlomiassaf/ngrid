import * as Path from 'path';
import * as FS from 'fs';
import { dest, task, series } from 'gulp';
import { Bundler } from 'scss-bundle';
import { writeFile } from 'fs-extra';
import * as globby from 'globby';
import { resolve, virtualFs } from '@angular-devkit/core';
import { normalizeAssetPatterns } from '@angular-devkit/build-angular/src/utils/normalize-asset-patterns';
import * as log from 'ng-packagr/lib/utils/log';

import { EntryPointTaskContext, Job } from 'ng-cli-packagr-tasks';
import { buildScssPipeline } from '../tasks/package-tools/gulp/build-scss-pipeline';

declare module 'ng-cli-packagr-tasks/dist/build/hooks' {
  interface NgPackagrBuilderTaskSchema {
    sassBundle: {
      entries: string[];
    };
    sassCompile: {
      entries: string[];
    }
  }
}

async function sassBundleTask(context: EntryPointTaskContext) {

  const globalContext = context.context();
  if (context.epNode.data.entryPoint.isSecondaryEntryPoint) {
    return;
  }

  const { builderContext, workspace, root, projectRoot, sourceRoot, options } = globalContext;
  const host = new virtualFs.AliasHost(workspace.host as virtualFs.Host<FS.Stats>);
  const syncHost = new virtualFs.SyncDelegateHost<FS.Stats>(host);

  if (!options.tasks.data.sassBundle) {
    return;
  }

  const assets = normalizeAssetPatterns(
    options.tasks.data.sassBundle.entries,
    syncHost as any,
    root,
    projectRoot,
    sourceRoot,
  );

  const copyPatterns = buildCopyPatterns(root, assets);
  const copyOptions = { ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'] };

  log.info('Bundling a sass bundles...');

  const promises = copyPatterns.map( pattern => {
    const fullPattern = pattern.context + pattern.from.glob;
    const opts = { ...copyOptions, dot: pattern.from.dot };
    return globby(fullPattern, opts)
      .then(entries => {
        const entryPromises = entries.map( entry => {
          const cleanFilePath = entry.replace(pattern.context, '');
          const to = Path.resolve(root, pattern.to, cleanFilePath);
          const pathToFolder = Path.dirname(to);
          pathToFolder.split('/').reduce((p, folder) => {
            p += folder + '/';

            if (!FS.existsSync(p)) {
              FS.mkdirSync(p);
            }
            return p;
          }, '');

          return bundleScss(root, entry, to);
        });
        return Promise.all(entryPromises);
      });
  });

  try {
    await Promise.all(promises);
  } catch (err) {
    builderContext.logger.error(err.toString());
    throw err;
  }
}

async function sassCompileTask(context: EntryPointTaskContext) {
  const globalContext = context.context();
  if (context.epNode.data.entryPoint.isSecondaryEntryPoint) {
    return;
  }

  const { builderContext, workspace, root, projectRoot, sourceRoot, options } = globalContext;
  const host = new virtualFs.AliasHost(workspace.host as virtualFs.Host<FS.Stats>);
  const syncHost = new virtualFs.SyncDelegateHost<FS.Stats>(host);

  if (!options.tasks.data.sassCompile) {
    return;
  }

  const assets = normalizeAssetPatterns(
    options.tasks.data.sassCompile.entries,
    syncHost as any,
    root,
    projectRoot,
    sourceRoot,
  );

  const copyPatterns = buildCopyPatterns(root, assets);
  log.info('Compiling sass bundles...');

  const destPath = Path.join(root, copyPatterns[0].to);

  const taskName = context.epNode.data.entryPoint.moduleId + ':css';
  task(taskName, () => {
    return buildScssPipeline(copyPatterns[0].context, [ Path.join(root, 'node_modules/') ], true).pipe(dest(destPath));
  });

  try {
    await new Promise( (resolve, reject) => {
      series(taskName)( (err?: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (err) {
    builderContext.logger.error(err.toString());
    throw err;
  }
}

function buildCopyPatterns(root: string, assets: ReturnType< typeof normalizeAssetPatterns>) {
  return assets.map( asset => {

    // Resolve input paths relative to workspace root and add slash at the end.
    asset.input = Path.resolve(root, asset.input).replace(/\\/g, '/');
    asset.input = asset.input.endsWith('/') ? asset.input : asset.input + '/';
    asset.output = asset.output.endsWith('/') ? asset.output : asset.output + '/';

    if (asset.output.startsWith('..')) {
      const message = 'An asset cannot be written to a location outside of the output path.';
      throw new Error(message);
    }

    return {
      context: asset.input,
      // Now we remove starting slash to make Webpack place it from the output root.
      to: asset.output.replace(/^\//, ''),
      ignore: asset.ignore,
      from: {
        glob: asset.glob,
        dot: true,
      },
    };
  });
}

/** Bundles all SCSS files into a single file */
async function bundleScss(root: string, src: string, dest: string) {

  log.info('============================================== SCSS BUNDLE ==============================================');
  log.info(`= Source: ${src}`);
  log.info(`= Dest: ${dest}`);
  log.info(`=`);

	const { found, bundledContent, imports } = await new Bundler(undefined, root).Bundle(src, ["./!(dist|node_modules)/**/*.scss"], undefined, ["^~"]);

	if (imports) {
		const filesNotFound = imports
			.filter(x => !x.found && !x.ignored)
			.map(x => x.filePath);

		if (filesNotFound.length) {
      log.error(`= Error: SCSS imports failed`);
      log.error('= ' + filesNotFound.join('\n= '));
      log.info('=========================================================================================================');
			throw new Error('One or more SCSS imports failed');
		}
	}

	if (found) {
    await writeFile(dest, bundledContent);
    log.success(`= Bundle OK`);
    log.info('=========================================================================================================');
	}
}

@Job({
  schema: Path.resolve(__dirname, 'sass-build.json'),
  selector: 'sassBundle',
  hooks: {
    writePackage: {
      before: sassBundleTask
    }
  }
})
export class SassBundle { }

@Job({
  schema: Path.resolve(__dirname, 'sass-build.json'),
  selector: 'sassCompile',
  hooks: {
    writePackage: {
      before: sassCompileTask
    }
  }
})
export class SassCompile { }
