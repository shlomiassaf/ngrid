import * as path from 'path';
import * as fs from 'fs';
import { NgPackagerHooksContext, HookRegistry, EntryPointTaskContext } from 'ng-cli-packagr-tasks';
import { ensureUnixPath } from 'ng-packagr/lib/utils/path';

import { CopyFile } from 'ng-cli-packagr-tasks/dist/tasks/copy-file';
import { NodeLib } from 'ng-cli-packagr-tasks/dist/tasks/node-lib';

import { WritePackageJson } from './tasks';

async function fixDtsReference(context: EntryPointTaskContext) {
  const { entryPoint } = context.epNode.data;
  const relativeUnixFromDestPath = (filePath: string) => ensureUnixPath(path.relative(entryPoint.destinationPath, filePath));

  const actionsDtsPath = path.join(entryPoint.destinationPath, 'lib/ngrid-harness/actions.d.ts');
  const content = fs.readFileSync(actionsDtsPath, { encoding: 'utf-8'})
    .replace(`/// <reference types="./extend-cypress" />`, `/// <reference types="../extend-cypress" />`);
  fs.writeFileSync(actionsDtsPath, content, { encoding: 'utf-8' });
}

module.exports = function(ctx: NgPackagerHooksContext, registry: HookRegistry) {
  registry
    .register(NodeLib)
    .register('writePackage', { before: fixDtsReference })
    .register(WritePackageJson)
    .register(CopyFile);
}

