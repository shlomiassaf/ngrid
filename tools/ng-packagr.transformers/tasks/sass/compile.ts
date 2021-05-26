import * as Path from 'path';
import * as FS from 'fs';
import { dest, task, series } from 'gulp';

import { virtualFs } from '@angular-devkit/core';
import * as log from 'ng-packagr/lib/utils/log';

import { EntryPointTaskContext, Job } from 'ng-cli-packagr-tasks';
import { CopyFile } from 'ng-cli-packagr-tasks/dist/tasks/copy-file';

import { buildScssPipeline } from './build-scss-pipeline';

declare module 'ng-cli-packagr-tasks/dist/build/hooks' {
  interface NgPackagrBuilderTaskSchema {
    sassCompile: {
      entries: string[];
    }
  }
}

async function sassCompileTask(context: EntryPointTaskContext) {
  const globalContext = context.context();
  if (context.epNode.data.entryPoint.isSecondaryEntryPoint) {
    return;
  }

  const { builderContext, root, projectRoot, sourceRoot, options } = globalContext;

  if (!options.tasks.data.sassCompile) {
    return;
  }

  const copyPatterns = CopyFile.createCopyPatterns(
    options.tasks.data.sassCompile.entries,
    new virtualFs.AliasHost(globalContext.host as virtualFs.Host<FS.Stats>),
    root,
    projectRoot,
    sourceRoot,
  );
  log.info('Compiling sass bundles...');

  const destPath = Path.join(root, copyPatterns[0].to);

  const taskName = context.epNode.data.entryPoint.moduleId + ':css';
  task(taskName, () => {
    return buildScssPipeline(copyPatterns[0].context, [ Path.join(root, 'node_modules/') ], true).pipe(dest(destPath));
  });

  try {
    await new Promise<void>( (resolve, reject) => {
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

@Job({
  schema: Path.resolve(__dirname, 'compile.schema.json'),
  selector: 'sassCompile',
  hooks: {
    writePackage: {
      before: sassCompileTask
    }
  }
})
export class SassCompile { }
