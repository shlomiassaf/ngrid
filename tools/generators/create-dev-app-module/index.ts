import * as Path from 'path';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/Typescript/lib/typescript';
import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  SchematicContext,
  Tree,
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { getSourceNodes, addDeclarationToModule, addExportToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

const ROOT = '/apps/ngrid-dev-app/src';

const stringsExtensions = {
  moduleFile: (name: string) => `${strings.dasherize(name)}.module`,
  componentFile: (name: string) => `${strings.dasherize(name)}.component`,
  moduleClassName: (name: string) => strings.classify(`${name}ExampleModule`),
  componentClassName: (name: string) => strings.classify(`${name}Example`),
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function addRouteItem(parsedPath: ReturnType<typeof createPath>, title: string): Rule {
  return (host: Tree) => {
    const modulePath = `${ROOT}/routes.ts`;
    const source = readIntoSourceFile(host, modulePath);

    const node = getSourceNodes(source).filter(node => node.kind === ts.SyntaxKind.ArrayLiteralExpression )[0];

    const code = `{
    path: '${parsedPath.path.substr(ROOT.length + 1).split('/').join('-')}',
    pathMatch: 'full',
    loadChildren: () => import('./${parsedPath.path.substr(ROOT.length + 1)}/${stringsExtensions.moduleFile(parsedPath.name)}').then(m => m.${stringsExtensions.moduleClassName(parsedPath.name)}),
    data: { name: '${title}' },
  }`;

    const change = new InsertChange(modulePath, node.getEnd() - 2, `,\n  ${code}`);
    const declarationRecorder = host.beginUpdate(modulePath);
    declarationRecorder.insertLeft(change.pos, change.toAdd);
    host.commitUpdate(declarationRecorder);

    return host;
  };
}

function addComponentToBindNgModule(source: ts.SourceFile,
                                           ngModulePath: string,
                                           symbolName: string,): Change[] {
  const nodes = getSourceNodes(source)
    .filter(node => ts.isDecorator(node) && node.expression.kind == ts.SyntaxKind.CallExpression )
    .map(node => (node as ts.Decorator).expression as ts.CallExpression )
    .filter( expr => {
      const identExp = expr.expression;
      return ts.isIdentifier(identExp) && identExp.text === 'BindNgModule';
    });

  let node: ts.CallExpression = nodes[0];  // tslint:disable-line:no-any

  // Find the decorator declaration.
  if (!node) {
    return [];
  }

  const position = node.arguments[node.arguments.length - 1].getEnd();
  return [
    new InsertChange(ngModulePath, position, `, ${symbolName}`),
  ];
}

function addDeclarationToNgModule(parsedPath: ReturnType<typeof createPath>, componentName: string): Rule {
  return (host: Tree) => {

    const modulePath = `/${parsedPath.path}/${stringsExtensions.moduleFile(parsedPath.name)}.ts`;
    const exampleModulePath = `/${parsedPath.path}/${stringsExtensions.componentFile(componentName)}`;
    const relativePath = buildRelativePath(modulePath, exampleModulePath);
    const classifiedName = stringsExtensions.componentClassName(componentName);
    let source = readIntoSourceFile(host, modulePath);

    const declarationChanges = addDeclarationToModule(source, modulePath, classifiedName, relativePath);
    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    // Need to refresh the AST because we overwrote the file in the host.
    source = readIntoSourceFile(host, modulePath);

    const exportRecorder = host.beginUpdate(modulePath);
    const exportChanges = addExportToModule(source, modulePath, classifiedName, relativePath);
    for (const change of exportChanges) {
      if (change instanceof InsertChange) {
        exportRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(exportRecorder);

    // Need to refresh the AST because we overwrote the file in the host.
    source = readIntoSourceFile(host, modulePath);

    // Need to refresh the AST because we overwrote the file in the host.
    source = readIntoSourceFile(host, modulePath);
    const bindNgModuleRecorder = host.beginUpdate(modulePath);
    const bindNgModuleChanges = addComponentToBindNgModule(source, modulePath, classifiedName);
    for (const change of bindNgModuleChanges) {
      if (change instanceof InsertChange) {
        bindNgModuleRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(bindNgModuleRecorder);

    return host;
  };
}

function createPath(name: string) {
  const pathParts = name.split('/');
  name = pathParts.pop();
  pathParts.push(strings.dasherize(name));
  return parseName(`${ROOT}/${pathParts.join('/') }`, name);
}

function buildSelector(name: string) {
  return `pbl-${strings.dasherize(name)}-example`;
}

export default function(options: { name: string; add?: string; }): Rule {
  return async (tree: Tree, _context: SchematicContext) => {

    const parsedPath = createPath(options.name);
    const fullPath = Path.join(parsedPath.path, stringsExtensions.componentFile(parsedPath.name) + '.ts');
    const componentFileExists = tree.exists(fullPath);
    options.name = parsedPath.name;

    if (!options.add && componentFileExists) {
      throw new SchematicsException(`${options.name} already exists, use "-add" to add more examples.`);
    }

    let rules: Rule[] = [];

    if (!componentFileExists) {
      const selector = buildSelector(parsedPath.name);
      const title = strings.underscore(parsedPath.name).split('_').map(strings.capitalize).join(' ');
      const urlPath = parsedPath.path.substr(ROOT.length + 1);

      const templateSource = apply(url('./files'), [
        applyTemplates({
          ...strings,
          ...stringsExtensions,
          name: parsedPath.name,
          selector,
          style: 'scss',
          title,
          path: urlPath,
          parent: urlPath.substr(0, urlPath.lastIndexOf('/')),
        }),
        move(parsedPath.path),
      ]);

      rules.push(
        addRouteItem(parsedPath, title),
        mergeWith(templateSource),
      );
    }

    if (options.add) {
      const additional = options.add.split(',').map( a => a.trim() );
      for (const additionalExampleName of additional) {
        const addParsedPath = { path: parsedPath.path, name: additionalExampleName };
        const addSelector = buildSelector(addParsedPath.name);
        const addTitle = strings.underscore(addParsedPath.name).split('_').map(strings.capitalize).join(' ');
        const addTemplateSource = apply(url('./files'), [
          filter(path => !path.endsWith('.module.ts.template')),
          applyTemplates({
            ...strings,
            ...stringsExtensions,
            name: addParsedPath.name,
            selector: addSelector,
            style: 'scss',
            title: addTitle,
          }),
          move(parsedPath.path),
        ]);

        rules.push(
          addDeclarationToNgModule(parsedPath, addParsedPath.name),
          mergeWith(addTemplateSource)
        );
      }
    }

    return rules.length ? chain(rules) : Promise.resolve( () => tree );
  }
}
