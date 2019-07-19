import * as Path from 'path';
import * as ts from 'typescript';
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
  noop,
  url,
} from '@angular-devkit/schematics';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { parseName } from '@schematics/angular/utility/parse-name';
import { InsertChange } from '@schematics/angular/utility/change';
import { addImportToModule, addDeclarationToModule, addEntryComponentToModule, addExportToModule } from '@schematics/angular/utility/ast-utils';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

const ROOT = '/apps/libs/ngrid-examples';

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

function addImportOfModuleToNgModule(parsedPath: ReturnType<typeof createPath>): Rule {
  return (host: Tree) => {
    const modulePath = `${ROOT}/example-module.ts`;
    const exampleModulePath = `/${parsedPath.path}/${stringsExtensions.moduleFile(parsedPath.name)}`;
    const relativePath = buildRelativePath(modulePath, exampleModulePath);
    const classifiedName = stringsExtensions.moduleClassName(parsedPath.name);
    const source = readIntoSourceFile(host, modulePath);

    const importChanges = addImportToModule(source,
                                            modulePath,
                                            classifiedName,
                                            relativePath);

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of importChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    return host;
  };
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

    const entryComponentRecorder = host.beginUpdate(modulePath);
    const entryComponentChanges = addEntryComponentToModule(source, modulePath, classifiedName, relativePath);
    for (const change of entryComponentChanges) {
      if (change instanceof InsertChange) {
        entryComponentRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(entryComponentRecorder);

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

function createMarkdown(title: string, selector: string, path: string) {
  const parent = path.substr(0, path.lastIndexOf('/'));
  return `---
title: ${title}
path: ${path}
parent: ${parent}
---
# ${title}

<div pbl-example-view="${selector}"></div>

`;
}

export default function(options: { name: string; add?: string; }): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    // const workspace = await getWorkspace(tree);
    // const project = workspace.projects.get(options.project as string);

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
      const templateSource = apply(url('./files'), [
        applyTemplates({
          ...strings,
          ...stringsExtensions,
          name: parsedPath.name,
          selector,
          style: 'scss',
          title,
        }),
        move(parsedPath.path),
      ]);

      console.log(createMarkdown(title, selector, parsedPath.path.substr(ROOT.length + 1)));

      rules.push(
        addImportOfModuleToNgModule(parsedPath),
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

        console.log(`<div pbl-example-view="${addSelector}"></div>\n`);

        rules.push(
          addDeclarationToNgModule(parsedPath, addParsedPath.name),
          mergeWith(addTemplateSource)
        );
      }
    }

    return rules.length ? chain(rules) : Promise.resolve( () => tree );
  }
}
