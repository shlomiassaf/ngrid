import * as Path from 'path';
import * as FS from 'fs';
import { Bundler } from 'scss-bundle';
import { writeFile } from 'fs-extra';
import * as globby from 'globby';
import { virtualFs } from '@angular-devkit/core';
import * as log from 'ng-packagr/lib/utils/log';

import { EntryPointTaskContext, Job } from 'ng-cli-packagr-tasks';
import { CopyFile } from 'ng-cli-packagr-tasks/dist/tasks/copy-file';

declare module 'ng-cli-packagr-tasks/dist/build/hooks' {
  interface NgPackagrBuilderTaskSchema {
    sassBundle: {
      entries: string[];
    };
  }
}

async function sassBundleTask(context: EntryPointTaskContext) {

  const globalContext = context.context();
  if (context.epNode.data.entryPoint.isSecondaryEntryPoint) {
    return;
  }

  const { builderContext, root, projectRoot, sourceRoot, options } = globalContext;

  if (!options.tasks.data.sassBundle) {
    return;
  }

  const copyPatterns = CopyFile.createCopyPatterns(
    options.tasks.data.sassBundle.entries,
    new virtualFs.AliasHost(globalContext.host as virtualFs.Host<FS.Stats>),
    root,
    projectRoot,
    sourceRoot,
  );
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

/** Bundles all SCSS files into a single file */
async function bundleScss(root: string, src: string, dest: string) {

  log.info('============================================== SCSS BUNDLE ==============================================');
  log.info(`= Source: ${src}`);
  log.info(`= Dest: ${dest}`);
  log.info(`=`);

	const { found, bundledContent, imports } = await new Bundler(undefined, root).bundle(src, ["./!(dist|node_modules)/**/*.scss"], undefined, ["^~"]);

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
  schema: Path.resolve(__dirname, 'bundle.schema.json'),
  selector: 'sassBundle',
  hooks: {
    writePackage: {
      before: sassBundleTask
    }
  }
})
export class SassBundle { }
