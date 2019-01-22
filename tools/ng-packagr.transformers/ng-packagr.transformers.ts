import * as Path from 'path';
import { NewlineKind } from '@microsoft/node-core-library';

import { NgPackagerTransformerHooks, NgPackagerTransformerHooksContext, EntryPointTaskContext } from 'ng-cli-packagr-tasks';
import { getApiPackage } from './api-extractor';

const COMPILED_PATH_MAPPINGS: { [key: string]: string[] } = {};
async function compileNgcTransformer(taskContext: EntryPointTaskContext) {
  const { entryPoint, tsConfig } = taskContext.epNode.data;

  if (!tsConfig.options.paths) {
    tsConfig.options.paths = {};
  }

  for (const pathKey in COMPILED_PATH_MAPPINGS) { //tslint:disable-line:forin
    const paths = tsConfig.options.paths[pathKey] || (tsConfig.options.paths[pathKey] = []);
    paths.unshift(...COMPILED_PATH_MAPPINGS[pathKey]);
  }

  COMPILED_PATH_MAPPINGS[entryPoint.moduleId] = [ entryPoint.destinationPath ];
  COMPILED_PATH_MAPPINGS[`${entryPoint.moduleId}/*`] = [ `${entryPoint.destinationPath}/*` ];
}

async function writePackageTransformer(taskContext: EntryPointTaskContext) {
  const { destinationFiles, tsConfig } = taskContext.epNode.data;

  const publicApiFilePath = destinationFiles.declarations;

  const tsConfigOptions = {
    include: [ publicApiFilePath ],
    exclude: ['libs', 'node_modules', 'tmp'],
    compilerOptions: {
      paths: JSON.parse(JSON.stringify(tsConfig.options.paths || []))
    },
  };

  const logger = {
    logVerbose(message: string): void { context.logger.debug(message); },
    logInfo(message: string): void { context.logger.info(message); },
    logWarning(message: string): void { context.logger.warn(message); },
    logError(message: string): void { context.logger.error(message); },
  };
  const apiPackage = getApiPackage(publicApiFilePath, tsConfigOptions, logger);

  const apiExtractorFilePath = Path.join(Path.dirname(publicApiFilePath), 'api-extractor.json');
  apiPackage.saveToJsonFile(apiExtractorFilePath, {
    newlineConversion: NewlineKind.CrLf,
    ensureFolderExists: true
  });
}

let context: NgPackagerTransformerHooksContext;

module.exports = function(ctx: NgPackagerTransformerHooksContext) {
  context = ctx;
  const hooks: NgPackagerTransformerHooks = {
    writeBundles: {
      after: async taskContext => {
      }
    },
    compileNgc: {
      before: compileNgcTransformer
    },
    writePackage: {
      after: writePackageTransformer
    },
  };
  return hooks;
}
