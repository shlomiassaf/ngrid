import * as ts from 'typescript';
import * as Path from 'path';
import { EntryPointNode, isEntryPoint, isPackage, PackageNode } from 'ng-packagr/lib/ng-package/nodes';
import { cacheCompilerHost } from 'ng-packagr/lib/ts/cache-compiler-host';
import { BuildGraph } from 'ng-packagr/lib/graph/build-graph';

import { ensureUnixPath } from 'ng-packagr/lib/utils/path';
import { EntryPointTaskContext, Job } from 'ng-cli-packagr-tasks';

declare module 'ng-cli-packagr-tasks/dist/build/hooks' {
  interface NgPackagrBuilderTaskSchema {
    analyseSources: {
    }
  }
}

async function analyseSourcesWorkaround(context: EntryPointTaskContext) {
  const { graph } = context;
  const entryPoints = graph.filter(isEntryPoint);
  const dirtyEntryPoints = entryPoints.filter(x => x.state !== 'done');

  for (const entryPoint of dirtyEntryPoints) {
    analyseEntryPoint(graph, entryPoint, entryPoints);
  }

  return graph;
}

/**
 * Analyses an entrypoint, searching for TypeScript dependencies and additional resources (Templates and Stylesheets).
 *
 * @param graph Build graph
 * @param entryPoint Current entry point that should be analysed.
 * @param entryPoints List of all entry points.
 */
 function analyseEntryPoint(graph: BuildGraph, entryPoint: EntryPointNode, entryPoints: EntryPointNode[]) {
  const { oldPrograms, analysesSourcesFileCache, moduleResolutionCache } = entryPoint.cache;
  const oldProgram = oldPrograms && (oldPrograms['analysis'] as ts.Program | undefined);
  const { moduleId } = entryPoint.data.entryPoint;
  const packageNode: PackageNode = graph.find(isPackage);
  const primaryModuleId = packageNode.data.primary.moduleId;

  const tsConfigOptions: ts.CompilerOptions = {
    ...entryPoint.data.tsConfig.options,
    skipLibCheck: true,
    noLib: true,
    noEmit: true,
    types: [],
    target: ts.ScriptTarget.Latest,
    strict: false,
  };

  const compilerHost = cacheCompilerHost(
    graph,
    entryPoint,
    tsConfigOptions,
    moduleResolutionCache,
    undefined,
    analysesSourcesFileCache,
    false,
  );

  const potentialDependencies = new Set<string>();

  compilerHost.resolveModuleNames = (moduleNames: string[], containingFile: string) => {
    return moduleNames.map(moduleName => {
      if (!moduleName.startsWith('.')) {
        if (moduleName === primaryModuleId || moduleName.startsWith(`${primaryModuleId}/`)) {
          potentialDependencies.add(moduleName);
        }

        return undefined;
      }

      const { resolvedModule } = ts.resolveModuleName(
        moduleName,
        ensureUnixPath(containingFile),
        tsConfigOptions,
        compilerHost,
        moduleResolutionCache,
      );

      return resolvedModule;
    });
  };

  const program: ts.Program = ts.createProgram(
    entryPoint.data.tsConfig.rootNames,
    tsConfigOptions,
    compilerHost,
    oldProgram,
  );

  entryPoint.cache.oldPrograms = { ...entryPoint.cache.oldPrograms, ['analysis']: program };

  const entryPointsMapped: Record<string, EntryPointNode> = {};
  for (const dep of entryPoints) {
    entryPointsMapped[dep.data.entryPoint.moduleId] = dep;
  }

  for (const moduleName of Array.from(potentialDependencies)) {
    const dep = entryPointsMapped[moduleName];

    if (dep) {

      if (moduleId === moduleName) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on itself.`);
      }

      if (dep.some(n => entryPoint === n)) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on ${moduleId}.`);
      }

      entryPoint.dependsOn(dep);
    } else {
      // throw new Error(`Entry point ${moduleName} which is required by ${moduleId} doesn't exists.`);
    }
  }
}

@Job({
  schema: Path.resolve(__dirname, 'analyse-sources-workaround.schema.json'),
  selector: 'analyseSourcesWorkaround',
  hooks: {
    analyseSources: {
      replace: analyseSourcesWorkaround
    }
  }
})
export class AnalyseSourcesWorkaround { }
