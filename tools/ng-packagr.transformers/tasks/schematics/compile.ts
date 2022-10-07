import * as Path from 'path';
import * as ts from 'typescript';

import { normalize } from '@angular-devkit/core';
import * as log from 'ng-packagr/lib/utils/log';

import { EntryPointTaskContext, Job } from 'ng-cli-packagr-tasks';
import { CopyFile, CopyPattern } from 'ng-cli-packagr-tasks/dist/tasks/copy-file';
import { ngCompilerCli } from 'ng-cli-packagr-tasks/dist/tasks/ngc-cli-utils';

declare module 'ng-cli-packagr-tasks/dist/build/hooks' {
  interface NgPackagrBuilderTaskSchema {
    schematicsCompile: {
      libPath: string;
      tsConfig?: string;
    }
  }
}

function readTsConfig(configFile: string): ts.ParsedCommandLine {
  const rawConfigRead = ts.readConfigFile(configFile, ts.sys.readFile);
  if (rawConfigRead.error) {
    return {
      options: {},
      fileNames: [],
      errors: [ rawConfigRead.error ],
    };
  }

  return ts.parseJsonConfigFileContent(rawConfigRead.config, ts.sys, Path.dirname(configFile), undefined, Path.basename(configFile));
}

async function schematicsCompileTask(context: EntryPointTaskContext) {
  const globalContext = context.context();
  const { entryPoint } = context.epNode.data;

  if (entryPoint.isSecondaryEntryPoint) {
    return;
  }

  const schematicsCompile = globalContext.options.tasks.data.schematicsCompile;
  if (!schematicsCompile) {
    return;
  }

  const { builderContext, root, projectRoot } = globalContext;

  const rootDir = normalize(Path.join(projectRoot, schematicsCompile.libPath));
  const destDir = Path.join(entryPoint.destinationPath, schematicsCompile.libPath);

  const copyPatterns = CopyFile.createCopyPatterns(
    [
      {
        glob: '**/*.json',
        input: Path.relative(root, rootDir),
        output: Path.relative(root, destDir),
      },
      {
        glob: '**/*.template',
        input: Path.relative(root, rootDir),
        output: Path.relative(root, destDir),
      }
    ],
    root,
    rootDir,
    rootDir,
  );
  const copyOptions = { ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db', '**/tsconfig.json'] };
  const onCopy = (pattern: CopyPattern, from: string, to: string) => {
    log.success(` - from: ${from}`);
    log.success(` - to: ${to}`);
  };

  try {
    await CopyFile.executeCopyPatterns(copyPatterns, root, copyOptions, onCopy)
  } catch (err) {
    builderContext.logger.error(err.toString());
    throw err;
  }

  const tsConfigPath = Path.join(rootDir, schematicsCompile.tsConfig || './tsconfig.json');
  const parsedTsConfig = readTsConfig(tsConfigPath);

  const { exitCodeFromResult, formatDiagnostics } = await ngCompilerCli();
  if (parsedTsConfig.errors.length > 0) {
    const exitCode = exitCodeFromResult(parsedTsConfig.errors);
    if (exitCode !== 0) {
      return Promise.reject(new Error(formatDiagnostics(parsedTsConfig.errors)));
    }
  }

  log.debug(`Initializing tsconfig for ${entryPoint.moduleId}`);

  const overrideOptions: ts.CompilerOptions = {
    rootDir,
    outDir: destDir,
  };

  const tsConfig = {
    options: Object.assign(JSON.parse(JSON.stringify(parsedTsConfig.options)), overrideOptions),
    projectReferences: parsedTsConfig.projectReferences,
  };

  const program = ts.createProgram({
    rootNames: parsedTsConfig.fileNames,
    options: tsConfig.options,
  });

  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  const exitCode = exitCodeFromResult(allDiagnostics);
  if (exitCode !== 0) {
    throw new Error(formatDiagnostics(allDiagnostics));
  }
}

@Job({
  schema: Path.resolve(__dirname, 'compile.schema.json'),
  selector: 'schematicsCompile',
  hooks: {
    writePackage: {
      before: schematicsCompileTask
    }
  }
})
export class SchematicsCompile { }
