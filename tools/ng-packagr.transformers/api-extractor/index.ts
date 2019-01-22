import * as Path from 'path';
import * as ts from '@microsoft/api-extractor/node_modules/typescript';

import './patches-and-fixes';

import { ILogger } from '@microsoft/api-extractor/lib/api/ILogger';
import { Collector } from '@microsoft/api-extractor/lib/collector/Collector';
import { ApiModelGenerator } from '@microsoft/api-extractor/lib/generators/ApiModelGenerator';
import { ApiPackage } from '@microsoft/api-extractor/lib/api/model/ApiPackage';

const SimpleLogger: ILogger = {
  logVerbose: (message: string) => console.log('(Verbose) ' + message),
  logInfo: (message: string) => console.log('(Verbose) ' + message),
  logWarning: (message: string) => console.warn('(Warn) ' + message),
  logError: (message: string) => console.error('(Error) ' + message),
};

const TS_DEFAULT_CONFIG_OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.ES2015,
  lib: [ "es2017", "dom" ],
  baseUrl: '.',
  rootDir: '.',
}

export function getApiPackage(entryPoint: string, tsConfigJson: any, logger: ILogger = SimpleLogger): ApiPackage {
  const compilerOptions = tsConfigJson.compilerOptions || {};
  const parsedCommandLine: ts.ParsedCommandLine = ts.parseJsonConfigFileContent(
    { ...tsConfigJson, compilerOptions: { ...TS_DEFAULT_CONFIG_OPTIONS, ...compilerOptions } },
    ts.sys,
    process.cwd()
  );

  const program: ts.Program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
  const rootDir: string | undefined = program.getCompilerOptions().rootDir;

  const collector: Collector = new Collector({
    program: program as any,
    entryPointFile: Path.isAbsolute(entryPoint) || !rootDir ? entryPoint : Path.resolve(rootDir, entryPoint),
    logger,
    policies: {},
    validationRules: {},
  });

  collector.analyze();
  const modelBuilder: ApiModelGenerator = new ApiModelGenerator(collector);
  return modelBuilder.buildApiPackage();
}
