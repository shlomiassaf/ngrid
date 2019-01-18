// SHARED MODULE.
// shared by all plugins through a symlink (might require moving to npm module)

import * as Path from 'path';
import * as FS from 'fs';
import * as ts from 'typescript';
import { ReflectionKind } from 'typedoc';
import { ChildableComponent, Component } from 'typedoc/dist/lib/utils';
import { ComponentEvent, ComponentHost } from 'typedoc/dist/lib/utils/component';
import { Reflection, TraverseProperty, Type } from 'typedoc/dist/lib/models';


// Typescript utils

function getExternalModuleName(node: ts.Node): ts.Expression | undefined {
  switch (node.kind) {
    case ts.SyntaxKind.ImportDeclaration:
      return (<ts.ImportDeclaration>node).moduleSpecifier;
    case ts.SyntaxKind.ImportEqualsDeclaration:
      let reference = (<ts.ImportEqualsDeclaration>node).moduleReference;
      return reference.kind === ts.SyntaxKind.ExternalModuleReference
        ? (<ts.ExternalModuleReference>reference).expression
        : undefined
        ;
    case ts.SyntaxKind.ExportDeclaration:
      return (<ts.ExportDeclaration>node).moduleSpecifier;
  }
}

/**
 * Returns the symbol for a dependency declaration.
 * @param node
 * @param checker
 * @return {Symbol|undefined}
 */
export function getDependencySymbol(node: ts.ImportDeclaration | ts.ImportEqualsDeclaration | ts.ExportDeclaration,
                                    checker: ts.TypeChecker): ts.Symbol | undefined {
  const moduleNameExpr = getExternalModuleName(node as any);
  if (moduleNameExpr) {
    // if they have a name, that is a string, i.e. not alias defition `import x = y`
    if (moduleNameExpr && moduleNameExpr.kind === ts.SyntaxKind.StringLiteral) {
      // Ask the checker about the "symbol: for this module name
      // it would be undefined if the module was not found (i.e. error)
      return checker.getSymbolAtLocation(moduleNameExpr);
    }
  }
}

/**
 * Returns a list of dependencies (symbols) for a source file.
 *
 * The symbols represent the source file, to get the actual SourceFile use getSymbolSourceFile()
 * @param sourceFile
 * @param checker
 * @return {ts.Symbol[]}
 */
export function getDependencies(sourceFile: ts.SourceFile, checker: ts.TypeChecker): ts.Symbol[] {
  let output: ts.Symbol[] = [];
  ts.forEachChild(sourceFile, node => {
    // Vist top-level import nodes
    const moduleSymbol = getDependencySymbol(<any>node, checker);
    if (moduleSymbol) {
      output.push(moduleSymbol);
    }
  });
  return output;
}

export function getSymbolSourceFile(symbol: ts.Symbol): ts.SourceFile {
  const declaration = symbol.getDeclarations()[0];
  return declaration && declaration.getSourceFile();
}


export function getLiteral(checker: ts.TypeChecker, node: ts.Node): any {
  switch (node.kind) {
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
    case ts.SyntaxKind.StringLiteral:
      return (node as ts.StringLiteral).text;
    case ts.SyntaxKind.NumericLiteral:
      return Number((node as ts.NumericLiteral).text);
    case ts.SyntaxKind.TrueKeyword:
      return true;
    case ts.SyntaxKind.FalseKeyword:
      return false;
    case ts.SyntaxKind.Identifier:
      return getLiteral(checker, checker.getSymbolAtLocation(node).valueDeclaration);
    case ts.SyntaxKind.VariableDeclaration:
      return getLiteral(checker, (node as ts.VariableDeclaration).initializer);
    case ts.SyntaxKind.BinaryExpression:
      if ((node as ts.BinaryExpression).operatorToken.kind === ts.SyntaxKind.PlusToken) {
        return getLiteral(checker, (node as ts.BinaryExpression).left) + getLiteral(checker, (node as ts.BinaryExpression).right);
      }
      break;
  }

  return node.getText();
}

export function getFlowNode<T extends ts.FlowNode>(node: ts.Node): T {
  return (<any> node).flowNode
}

/**
 * Returns the first unused enum numeric value
 * @param enumType The enum type
 * @param bitFlagMode Next flag is always the last flag times 2
 * @param start The first flag to start the search from (0 is not allowed when bitFlagMode is true)
 * @return {number}
 */
export function findNextEnum(enumType: any, bitFlagMode: boolean = false, start: number = 0): number {
  if (bitFlagMode && start === 0) {
    start = 1;
  }

  while (true) {
    if (enumType.hasOwnProperty(start)) {
      start += bitFlagMode ? start : 1;
    } else {
      return <any> start;
    }
  }
}

/**
 * Create a new enumeration key value pair.
 *
 * The value is automatically calculated by using [[findNextEnum]]
 *
 * @param enumType The enum type
 * @param strValue The key to pair to the value.
 * @param bitFlagMode Next flag is always the last flag times 2
 * @param start The first flag to start the search from (0 is not allowed when bitFlagMode is true)
 */
export function createEnumKey<T, P extends keyof T>(enumType: T, strValue: P, bitFlagMode?: boolean, start?: number): void;
export function createEnumKey<T, P extends keyof T>(enumType: T, keyValue: number, strValue: P): void;
export function createEnumKey<T, P extends keyof T>(enumType: T, keyOrStrValue: P | number, strValueOrBitFlagMode?: boolean | P, start?: number): void {
  let flag: number;
  let strValue: P;
  let bitFlagMode: boolean;
  if (typeof keyOrStrValue === 'number' && typeof strValueOrBitFlagMode === 'string') {
    flag = keyOrStrValue as any;
    strValue = strValueOrBitFlagMode;
  } else {
    strValue = <any> keyOrStrValue;
    start = start || 0;
    bitFlagMode = !!strValueOrBitFlagMode;
    flag = findNextEnum(enumType, bitFlagMode, start)
  }

  enumType[strValue] = <any> flag;
  enumType[flag] = strValue;
}

// typedoc utils
export function isReflection(reflection: any): reflection is Reflection {
  return reflection instanceof Reflection;
}

export function isType(obj: any): obj is Type {
  return obj instanceof Type;
}

/**
 * Invoke 'callback' when a component with the name 'compName' register as a plugin of 'host'.
 * 'callback' will fire even if component is already registered, in that case 'callback' will invoke
 * immediately (no async)
 *
 * When the 'callback' contains an event parameter it means that the component did not exist
 * at the time `onComponentAdded` was called but added later.
 * @param host
 * @param compName
 * @param callback
 */
export function onComponentAdded<THost extends ComponentHost, C extends Component>(
                                          host: ChildableComponent<THost, C>,
                                          compName: string,
                                          callback: (c: C, event?: ComponentEvent) => void): void {
  if (host.hasComponent(compName)) {
    callback(host.getComponent(compName));
  } else {
    const onAdded = (event: ComponentEvent) => {
      if (event.component.componentName === compName) {
        host.off(ComponentEvent.ADDED, onAdded);
        callback(<any> event.component, event);
      }
    };
    host.on(ComponentEvent.ADDED, onAdded);
  }
}

/**
 * All the property keys that contatin children of a reflection.
 */
export const REFLECTION_CHILD_KEYS = Object.keys(TraverseProperty)
  .filter( curr => Number.isNaN(Number(curr)) )
  .map( key => {
    return key.substr(0, 1).toLowerCase() + key.substr(1);
  });

/**
 * All the property keys that contain runtime (i.e. no typeParameter) children of a reflection.
 */
export const REFLECTION_RUNTIME_CHILD_KEYS = REFLECTION_CHILD_KEYS
  .filter( key => key !== 'typeLiteral');

/**
 * Test whether a reflection is of the given kind or kinds, if it's not it will try to see if the
 * parent of the reflection is of the given kind or kinds until it will find a match or reach the
 * root of the tree.
 */
export function kindOfFamily(reflection: any, kind: ReflectionKind | ReflectionKind[]): boolean {
  return !!findAncestorOfKind(reflection, kind);
}

export function findAncestorOfKind(reflection: any, kind: ReflectionKind | ReflectionKind[]): any {
  while(reflection) {
    if (reflection.kindOf(kind)) {
      return reflection;
    }
    reflection = reflection.parent;
  }
}

/**
 * Resolves a user defined option that can be a static value or a pointer to an exported module member.
 *
 * A pointer is a string with 2 parts separated by a pound sign (#).
 * The first part is a relative path to the module, the 2nd part (after the #) is the property name.
 * @param value
 * @return {any}
 */
export function getOption(value: any): any {
  if (typeof value === 'string') {
    const pointer = value.split('#');
    if (pointer.length > 1) {
      const absPath = Path.join(process.cwd(), pointer[0]);
      return require(absPath)[pointer[1]];
    }
  }
  return value;
}

/**
 * Resolves a user defined option that can be a static value or a pointer to an exported module member.
 *
 * A pointer is a string with 2 parts separated by a pound sign (#).
 * The first part is a relative path to the module, the 2nd part (after the #) is the property name.
 * If the exported property is a function it is invoked with the argumnets supplied.
 * @param value
 * @param args
 * @return {any}
 */
export function getOptionValue(value: any, ...args: any[]): any {
  const fnOrProp = getOption(value);
  if (typeof fnOrProp === 'function') {
    return fnOrProp(...args);
  } else {
    return fnOrProp;
  }
}

/**
 * Performs a deep (recursive) search in 'obj' using `predicate` as criteria, invoking the callback
 * 'onMatch' when 'predicate' hits.
 *
 * There are 2 logical outputs for `predicate`:
 *    - Match: `obj` matched criteria
 *    - Mo Match: `obj` did not match criteria
 *
 * On **Match** the `onMatch` handler is invoked and `obj` a recursive deep search is skipped for `obj`.
 * When **No Match** performing a recursive deep search is skipped for `obj` depends on the return
 * value from `predicate`.
 *
 * The predicate function must return true / false or -1
 *   - true: Found match, invoke `onMatch` (does not deepSearch the object)
 *   - false: No match, perform recursive deepSearch into `obj`
 *   - -1: No match,  don't perform recursive deepSearch into `obj`
 *
 * > Does not run 'predicate' check on `obj`, make sure to check the initial value if it might match.
 *
 * @param obj An object or an Array
 * @param predicate
 * @param onMatch A callback that will invoke when 'predicate' returns true.
 * Has 3 parameters:
 *   - parent:  The parent that holds the object found (array or object)
 *   - key:     The key on the parent that reference the matched object. (number or string)
 *   - obj:     The object that matched in the 'predicate'
 */
export function deepSearch(this: Set<any> | void,
                           obj: any,
                           predicate: (obj: any, key: string | number) => boolean | -1,
                           onMatch: (parent: any, key: string | number, obj: any) => void): void {
  const history: Set<any> = this instanceof Set ? <any>this : new Set<any>();

  if (!history.has(obj)) {
    if (Array.isArray(obj)) {
      history.add(obj);
      for (let idx = 0, len = obj.length; idx < len; idx++) {
        switch (predicate(obj[idx], idx)) {
          case true:
            onMatch(obj, idx, obj[idx]);
            break;
          case false:
            deepSearch.call(history, obj[idx], predicate, onMatch)
            break;
        }
      }
    }

    switch (typeof obj) {
      case 'function':
      case 'object':
        if (obj !== null) {
          history.add(obj);
          const keys = Object.keys(obj);
          for (let key of keys) {
            switch (predicate(obj[key], key)) {
              case true: {
                onMatch(obj, key, obj[key]);
                break;
              }
              case false: {
                deepSearch.call(history, obj[key], predicate, onMatch);
                break;
              }
            }
          }
        }
        break;
    }
  }
}

/**
 *
 * @param obj
 * @param predicate
 * @param transform
 * @return {any}
 */
export function transformIf(obj: any, predicate: (obj: any) => boolean, transform: (obj: any) => any) {
  if (predicate(obj)) {
    return transform(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map( o => transformIf(o, predicate, transform));
  }

  switch (typeof obj) {
    case 'function':
    case 'object':
      if (obj !== null) {
        Object.keys(obj).forEach( k => obj[k] = transformIf(obj[k], predicate, transform));
      }
      break;
  }

  return obj;
}

export function getFileSizeKb(path: string): number {
  return FS.statSync(path).size / 1024;
}
