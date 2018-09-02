import * as ts from 'typedoc/node_modules/typescript';
import { Reflection, ReflectionKind } from 'typedoc';
import { Context } from "typedoc/dist/lib/converter";

export interface SymbolsToReflectionsResult {
  exported: Map<Reflection, ts.Symbol | true>;
  notFound?: ts.Symbol[],
  multiMatch?: Array<{ symbol: ts.Symbol, matches: Array<[Reflection, Reflection]> }>;
}


function referenceValidator(r1: Reflection, r2: Reflection): boolean {
  return r1 === r2;
}

function typeAliasValidator(r1: Reflection, r2: Reflection): boolean {
  return r1.kindOf(ReflectionKind.TypeAlias) || r2.kindOf(ReflectionKind.TypeAlias);
}


function multiMatchInspector(found:  Reflection[],
                             validators?: Array<(r1: Reflection, r2: Reflection) => boolean>): Array<[Reflection, Reflection]> {
  const result = [];
  for ( let i = 0, len = found.length; i < len; i++) {
    for ( let n = i + 1; n < len; n++) {
      if (referenceValidator(found[i], found[n])
        || (validators && !validators.some( v => v(found[i], found[n]) )) ) {
        result.push(found[i], found[n]);
      }
    }
  }
  return result;
}


export function createSymbolToReflectionMatcher(context: Context, reflections?: Reflection[] ) {
  const changeContext = (context: Context, refs?: Reflection[] ): void => {
    reflections = refs;
  };

  const getFileSymbolFromPath = (entryPoint: string): ts.Symbol => {
    const sourceFile = context.program.getSourceFiles().find( sf => sf.fileName === entryPoint);

    if (!sourceFile) {
      context.getLogger().error(`LibraryModePlugin: Could not find entry point ${entryPoint}`);
      return;
    }
    return <any> context.checker.getSymbolAtLocation(<any> sourceFile);
  };

  const reflectionFromSymbol = (symbol: any) => {
    return context.project.reflections[context.project.symbolMapping[context.getSymbolID(symbol)]];
  };

  const getDeclaredReflectionOfSymbol = (symbol: ts.Symbol): Reflection | undefined => {
    const type = context.checker.getDeclaredTypeOfSymbol(<any> symbol);
    return reflectionFromSymbol(type.aliasSymbol || type.symbol);
  };

  const getExportedReflectionOfSymbol = (symbol: ts.Symbol): Reflection | undefined => {
    if (symbol.flags & ts.SymbolFlags.ExportStar
      && symbol.declarations
      && ts.isExportSpecifier(symbol.declarations[0])) {
      const exportedSymbol = context.checker.getExportSpecifierLocalTargetSymbol(<any> symbol.declarations[0]);
      return reflectionFromSymbol(exportedSymbol);
    }
  };

  const getExportedReflectionsFromSymbols = (symbols: ts.Symbol[]): SymbolsToReflectionsResult => {
    const exported = new Map<Reflection, ts.Symbol | true>();
    const notFound: ts.Symbol[] = [];
    const multiMatch: Array<{ symbol: ts.Symbol, matches: Array<[Reflection, Reflection]> }> = [];

    const deepExposeChildren = ( reflection => {
      exported.set(reflection, true);
      reflection.traverse(deepExposeChildren);
    });

    for (let s of symbols) {
      const found: Reflection[] = [
        getExportedReflectionOfSymbol(s),
        getDeclaredReflectionOfSymbol(s)
      ].filter( r => !!r );

      const matches = multiMatchInspector(found, [typeAliasValidator]);
      if (matches.length > 0) {
        multiMatch.push( { symbol: s, matches });
      }

      const reflection = found[0] || reflectionFromSymbol(s);

      if (reflection) {
        // we don't override
        // if a reflection already exists it means it was previously detected, previous exports
        // are closed to the index file, i.e. they are the public exports.
        if (!exported.has(reflection)) {
          exported.set(reflection, s);
          reflection.traverse(deepExposeChildren);
        }
      } else {
        notFound.push(s);
      }
    }

    const result: SymbolsToReflectionsResult = { exported };
    if (notFound.length > 0) {
      result.notFound = notFound;
    }
    if (multiMatch.length > 0) {
      result.multiMatch = multiMatch;
    }

    return result;
  };

  const traverseDeleteIf = (result: SymbolsToReflectionsResult,
                            predicate: (r: Reflection, isExported: boolean, s?: ts.Symbol) => boolean): void => {

    if (!reflections) {
      const reflectionsMap = context.project.reflections;
      reflections = Object.keys(reflectionsMap).map( k => reflectionsMap[k]);
    }

    for (let i = 0, len = reflections.length; i < len; i++) {
      const reflection = reflections[i];
      if (reflection) {
        const symbol = result.exported.get(reflection);
        if (predicate(reflection, !!symbol, symbol === true ? undefined : symbol)) {
          context.removeReflection(reflection, true);
        }
        if (symbol) {
          result.exported.delete(reflection);
        }
      }
    }
  };

  return {
    changeContext,
    getFileSymbolFromPath,
    getExportedReflectionsFromSymbols,
    traverseDeleteIf
  }
}
