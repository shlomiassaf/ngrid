import { EntryPointTaskContext } from 'ng-cli-packagr-tasks';

export function updatePathsFromCache(taskContext: EntryPointTaskContext, pathMappingsCache: { [ tsPath: string ]: string[] }): void {
  const { entryPoint, tsConfig } = taskContext.epNode.data;

  if (!tsConfig.options.paths) {
    tsConfig.options.paths = {};
  }

  for (const pathKey in pathMappingsCache) { //tslint:disable-line:forin
    const paths = tsConfig.options.paths[pathKey] || (tsConfig.options.paths[pathKey] = []);
    paths.unshift(...pathMappingsCache[pathKey]);
  }

  pathMappingsCache[entryPoint.moduleId] = [ entryPoint.destinationPath ];
  pathMappingsCache[`${entryPoint.moduleId}/*`] = [ `${entryPoint.destinationPath}/*` ];
}
