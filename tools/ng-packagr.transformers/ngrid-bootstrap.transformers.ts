import { NgPackagerHooksContext, EntryPointTaskContext, HookRegistry } from 'ng-cli-packagr-tasks';
import { CopyFile } from 'ng-cli-packagr-tasks/dist/tasks/copy-file';
import { Bump } from 'ng-cli-packagr-tasks/dist/tasks/bump';

import { mergeUmdIds, updatePathsFromCache } from './base';
import { SassCompile } from './tasks';

const COMPILED_PATH_MAPPINGS: { [key: string]: string[] } = {};
async function compileNgcTransformer(taskContext: EntryPointTaskContext) {
  updatePathsFromCache(taskContext, COMPILED_PATH_MAPPINGS);
}

async function writeBundles(context: EntryPointTaskContext) {
  mergeUmdIds(context, {
    '@ng-bootstrap/ng-bootstrap': 'ngb',
    '@pebula/ngrid': 'pebula.ngrid',
    '@pebula/ngrid/core': 'pebula.ngrid.core',
    '@pebula/ngrid/target-events': 'pebula.ngrid.target-events',
    '@pebula/ngrid/overlay-panel': 'pebula.ngrid.overlay-panel',
  });
}

module.exports = function(ctx: NgPackagerHooksContext, registry: HookRegistry) {
  registry
    .register('compileNgc', { before: compileNgcTransformer })
    .register('writeBundles', { before: writeBundles })
    .register(CopyFile)
    .register(SassCompile)
    .register(Bump);
}
