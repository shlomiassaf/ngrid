import { NgPackagerHooksContext, EntryPointTaskContext, HookRegistry } from 'ng-cli-packagr-tasks';
import { CopyFile } from 'ng-cli-packagr-tasks/dist/tasks/copy-file';
import { Bump } from 'ng-cli-packagr-tasks/dist/tasks/bump';

import { updatePathsFromCache } from './base';
import { SassBundle, SassCompile } from './sass-build-task';

const COMPILED_PATH_MAPPINGS: { [key: string]: string[] } = {};
async function compileNgcTransformer(taskContext: EntryPointTaskContext) {
  updatePathsFromCache(taskContext, COMPILED_PATH_MAPPINGS);
}

module.exports = function(ctx: NgPackagerHooksContext, registry: HookRegistry) {
  registry
    .register('compileNgc', { before: compileNgcTransformer })
    .register(CopyFile)
    .register(SassBundle)
    .register(SassCompile)
    .register(Bump);
}
