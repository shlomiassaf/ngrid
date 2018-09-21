import { pipe } from 'rxjs';

import { COMPILE_NGC_TRANSFORM } from 'ng-packagr/lib/ng-v5/entry-point/ts/compile-ngc.di';
import { transformFromPromise } from 'ng-packagr/lib/brocc/transform';
import { isEntryPointInProgress, EntryPointNode } from 'ng-packagr/lib/ng-v5/nodes';

export const CUSTOM_COMPILE_NGC_TRANSFORM = { ...COMPILE_NGC_TRANSFORM };

const COMPILED_PATH_MAPPINGS: { [key: string]: string[] } = {};

CUSTOM_COMPILE_NGC_TRANSFORM.useFactory = (...args: any[]) => pipe(
  transformFromPromise( async graph => {
    const entryPointNode = graph.find(isEntryPointInProgress()) as EntryPointNode;
    const { entryPoint, tsConfig } = entryPointNode.data;

    if (!tsConfig.options.paths) {
      tsConfig.options.paths = {};
    }

    for (const pathKey in COMPILED_PATH_MAPPINGS) { //tslint:disable-line:forin
      const paths = tsConfig.options.paths[pathKey] || (tsConfig.options.paths[pathKey] = []);
      paths.unshift(...COMPILED_PATH_MAPPINGS[pathKey]);
    }

    COMPILED_PATH_MAPPINGS[entryPoint.moduleId] = [ entryPoint.destinationPath ];
    COMPILED_PATH_MAPPINGS[`${entryPoint.moduleId}/*`] = [ `${entryPoint.destinationPath}/*` ];
    return graph;
  }),
  COMPILE_NGC_TRANSFORM.useFactory(...args),
);
