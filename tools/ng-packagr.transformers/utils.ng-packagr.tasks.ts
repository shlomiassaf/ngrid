import { NgPackagerHooksContext, EntryPointTaskContext, HookRegistry } from 'ng-cli-packagr-tasks';
import { NodeLib } from 'ng-cli-packagr-tasks/dist/tasks/node-lib';

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

module.exports = function(ctx: NgPackagerHooksContext, registry: HookRegistry) {
  registry
    .register('compileNgc', { before: compileNgcTransformer })
    .register(NodeLib);
}
