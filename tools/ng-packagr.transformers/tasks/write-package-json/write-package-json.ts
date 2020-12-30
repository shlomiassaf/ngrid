import * as fs from 'fs-extra';
import * as Path from 'path';
import { NgEntryPoint } from 'ng-packagr/lib/ng-package/entry-point/entry-point';
import { NgPackage } from 'ng-packagr/lib/ng-package/package';
import * as log from 'ng-packagr/lib/utils/log';
import { ensureUnixPath } from 'ng-packagr/lib/utils/path';
import { rimraf } from 'ng-packagr/lib/utils/rimraf';
import { EntryPointTaskContext, Job } from 'ng-cli-packagr-tasks';
import { getDistEntryFile } from '../utils';

declare module 'ng-cli-packagr-tasks/dist/build/hooks' {
  interface NgPackagrBuilderTaskSchema {
    writePackageJson: {
    }
  }
}

async function writePackage(context: EntryPointTaskContext) {
  const { tsConfig, entryPoint } = context.epNode.data;
  const ngPackage: NgPackage = context.graph.find(node => node.type === 'application/ng-package').data;

  log.info('Writing package metadata');
  const relativeUnixFromDestPath = (filePath: string) => ensureUnixPath(Path.relative(entryPoint.destinationPath, filePath));

  // TODO: This will map the entry file to it's emitted output path taking rootDir into account.
  // It might not be fully accurate, consider using the compiler host to create a direct map.
  const distEntryFile = getDistEntryFile(entryPoint, tsConfig.options.rootDir);
  const distDtsEntryFile = distEntryFile.replace(/\.js$/, '.d.ts');

  await writePackageJson(entryPoint, ngPackage, {
    main: relativeUnixFromDestPath(distEntryFile),
    typings: relativeUnixFromDestPath(distDtsEntryFile),
  });

  log.success(`Built ${entryPoint.moduleId}`);
}

async function writePackageJson(entryPoint: NgEntryPoint,
                                pkg: NgPackage,
                                additionalProperties: { [key: string]: string | boolean | string[] }): Promise<void> {
  log.debug('Writing package.json');

  // set additional properties
  const packageJson = { ...entryPoint.packageJson, ...additionalProperties };

  // Verify non-peerDependencies as they can easily lead to duplicate installs or version conflicts
  // in the node_modules folder of an application
  const whitelist = pkg.whitelistedNonPeerDependencies.map(value => new RegExp(value));
  try {
    checkNonPeerDependencies(packageJson, 'dependencies', whitelist);
  } catch (e) {
    await rimraf(entryPoint.destinationPath);
    throw e;
  }

  // Removes scripts from package.json after build
  if (packageJson.scripts) {
    if (pkg.keepLifecycleScripts !== true) {
      log.info(`Removing scripts section in package.json as it's considered a potential security vulnerability.`);
      delete packageJson.scripts;
    } else {
      log.warn(
        `You enabled keepLifecycleScripts explicitly. The scripts section in package.json will be published to npm.`,
      );
    }
  }

  // keep the dist package.json clean
  // this will not throw if ngPackage field does not exist
  delete packageJson.ngPackage;

  const packageJsonPropertiesToDelete = [
    'stylelint',
    'prettier',
    'browserslist',
    'devDependencies',
    'jest',
    'workspaces',
    'husky',
  ];

  for (const prop of packageJsonPropertiesToDelete) {
    if (prop in packageJson) {
      delete packageJson[prop];
      log.info(`Removing ${prop} section in package.json.`);
    }
  }

  packageJson.name = entryPoint.moduleId;

  // `outputJson()` creates intermediate directories, if they do not exist
  // -- https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md
  await fs.outputJson(Path.join(entryPoint.destinationPath, 'package.json'), packageJson, {
    spaces: 2,
  });
}

function checkNonPeerDependencies(packageJson: Record<string, unknown>, property: string, whitelist: RegExp[]) {
  if (!packageJson[property]) {
    return;
  }

  for (const dep of Object.keys(packageJson[property])) {
    if (whitelist.find(regex => regex.test(dep))) {
      log.debug(`Dependency ${dep} is whitelisted in '${property}'`);
    } else {
      log.warn(
        `Distributing npm packages with '${property}' is not recommended. Please consider adding ${dep} to 'peerDependencies' or remove it from '${property}'.`,
      );
      throw new Error(`Dependency ${dep} must be explicitly whitelisted.`);
    }
  }
}

@Job({
  schema: Path.resolve(__dirname, 'write-package-json.schema.json'),
  selector: 'writePackageJson',
  hooks: {
    writePackage: {
      before: writePackage
    }
  }
})
export class WritePackageJson { }
