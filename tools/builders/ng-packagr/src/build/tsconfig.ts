import * as Path from 'path';
import * as FS from 'fs';
import * as ts from 'typescript';
import { pipe, of } from 'rxjs';
import { ParsedConfiguration, formatDiagnostics, CompilerOptions } from '@angular/compiler-cli';

import * as log from 'ng-packagr/lib/util/log';
import { INIT_TS_CONFIG_TRANSFORM } from 'ng-packagr/lib/ng-v5/init/init-tsconfig.di';
import { ANALYSE_SOURCES_TRANSFORM } from 'ng-packagr/lib/ng-v5/init/analyse-sources.di';
import { COMPILE_NGC_TRANSFORM } from 'ng-packagr/lib/ng-v5/entry-point/ts/compile-ngc.di';

import { BuildGraph } from 'ng-packagr/lib/brocc/build-graph';
import { Transform, transformFromPromise } from 'ng-packagr/lib/brocc/transform';
import { isEntryPoint, isPackage, isEntryPointInProgress, ngUrl, PackageNode, EntryPointNode } from 'ng-packagr/lib/ng-v5/nodes';
import { createDefaultTsConfig } from 'ng-packagr/lib/ts/tsconfig';

export const CUSTOM_ANALYSE_SOURCES_TRANSFORM = { ...ANALYSE_SOURCES_TRANSFORM };
const updateSecondaryTsConfig = (graph: BuildGraph) => {
  const packages = graph.filter(isPackage) as PackageNode[];
  for (const pkg of packages) {
    if (pkg.data.secondaries.length) {
      const primaryNode = graph.get(ngUrl(pkg.data.primary.moduleId)) as EntryPointNode;
      customInitializeTsConfig(
        primaryNode.data.tsConfig,
        pkg.data.secondaries.map(sec =>  graph.get(ngUrl(sec.moduleId)) as EntryPointNode)
      );
    }
  }
  return graph
};

const analyseSourcesTransformFactory = CUSTOM_ANALYSE_SOURCES_TRANSFORM.useFactory;
CUSTOM_ANALYSE_SOURCES_TRANSFORM.useFactory = (...args: any[]) => pipe(
  transformFromPromise( async graph => analyseSourcesTransformFactory(...args)(of(graph) as any)
    .toPromise()
    .then(updateSecondaryTsConfig)
  )
);

export const CUSTOM_INIT_TS_CONFIG_TRANSFORM = { ...INIT_TS_CONFIG_TRANSFORM };
const customInitializeTsConfig = (defaultTsConfig: ParsedConfiguration, entryPoints: EntryPointNode[]) => {
  // initializeTsConfig(defaultTsConfig, entryPoints);

  if (defaultTsConfig.errors.length > 0) {
    throw formatDiagnostics(defaultTsConfig.errors);
  }

  entryPoints.forEach( currentEntryPoint => {
    const { entryPoint } = currentEntryPoint.data;
    if (!entryPoint.isSecondaryEntryPoint) {
      return;
    }

    const tsConfigPath = Path.join(entryPoint.basePath, Path.basename(defaultTsConfig.project));
    if (!FS.existsSync(tsConfigPath)) {
      return;
    }

    const tsConfig = createDefaultTsConfig(tsConfigPath);
    log.info(`Updating tsconfig for secondary entry point ${entryPoint.moduleId}`);

    const basePath = Path.dirname(entryPoint.entryFilePath);

    let jsx = tsConfig.options.jsx;
    switch (entryPoint.jsxConfig) {
      case 'preserve':
        jsx = ts.JsxEmit.Preserve;
        break;
      case 'react':
        jsx = ts.JsxEmit.React;
        break;
      case 'react-native':
        jsx = ts.JsxEmit.ReactNative;
        break;
      default:
        break;
    }

    const overrideOptions: CompilerOptions = {
      flatModuleId: entryPoint.moduleId,
      flatModuleOutFile: `${entryPoint.flatModuleFile}.js`,
      basePath,
      rootDir: basePath,
      lib: entryPoint.languageLevel ? entryPoint.languageLevel.map(lib => `lib.${lib}.d.ts`) : tsConfig.options.lib,
      declarationDir: basePath,
      sourceRoot: `ng://${entryPoint.moduleId}`,
      jsx
    };

    tsConfig.rootNames = [entryPoint.entryFilePath];
    tsConfig.options = { ...tsConfig.options, ...overrideOptions };
    currentEntryPoint.data.tsConfig = tsConfig;
  });
};


const initTsConfigTransformFactory = (defaultTsConfig: ParsedConfiguration): Transform =>
  transformFromPromise(async graph => {
    // Initialize tsconfig for each entry point
    const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];
    customInitializeTsConfig(defaultTsConfig, entryPoints);
    return graph;
  });

CUSTOM_INIT_TS_CONFIG_TRANSFORM.useFactory = initTsConfigTransformFactory;
