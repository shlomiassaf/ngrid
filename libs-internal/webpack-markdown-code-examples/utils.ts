import * as Path from 'path';
import * as ts from 'typescript';
import { ExampleFileAsset, ParsedComponentMetadata, ParsedPrimaryComponentMetadata } from './models';

export function extractLangFromFileName(fileName: string): string {
  const lang = Path.extname(fileName).substr(1);
  return lang === 'ts' ? 'typescript' : lang;
}

export function parseExampleTsFile(fileName: string, content: string): ParsedPrimaryComponentMetadata | undefined {
  const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, false);
  let primary: ParsedPrimaryComponentMetadata;
  const secondaries: ParsedComponentMetadata[] = [];

  const visitNode = (node: any): void => {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      if (node.decorators && node.decorators.length) {
        const meta: ParsedPrimaryComponentMetadata = <any> {
          component: node.name.text
        };

        for (const decorator of node.decorators) {
          if (decorator.expression.expression.text === 'Example') {
            if (primary) {
              throw new Error('Multiple examples in a single module are not supported.');
            }
            const [ selector, exampleMeta ] = decorator.expression.arguments;
            primary = meta;
            primary.example = {
              title: exampleMeta.properties.find(p => p.name?.text === 'title' ).initializer.text,
              additionalFiles: exampleMeta.properties.find(p => p.name?.text === 'additionalFiles' )?.initializer.elements.map( e => e.text),
            };

            primary.secondaries = secondaries;
            primary.selector = selector.text;
          } else if (decorator.expression.expression.text === 'Component') {
            for (const arg of decorator.expression.arguments) {
              for (const prop of arg.properties) {
                const propName = prop.name.text;

                // Since additional files can be also stylesheets, we need to properly parse
                // the styleUrls metadata property.
                if (propName === 'styleUrls' && ts.isArrayLiteralExpression(prop.initializer)) {
                  meta[propName] = prop.initializer.elements
                    .map((literal: ts.StringLiteral) => literal.text);
                } else {
                  meta[propName] = prop.initializer.text;
                }
              }
            }
          }
        }
        if (primary !== meta) {
          secondaries.push(meta);
        }
      }
    }

    ts.forEachChild(node, visitNode);
  };

  visitNode(sourceFile);

  return primary;
}

/**
 * Creates a list of all `ExampleFileAsset` from the `ParsedPrimaryComponentMetadata` down to it's secondaries.
 * All instances of `ExampleFileAsset` will have an empty contents which should be populated later.
 *
 * @param primaryFileName The path to the filename, note that only the filename is used and the path to it is omitted.
 * @param primary
 */
export function createInitialExampleFileAssets(primaryFileName: string, primary: ParsedPrimaryComponentMetadata) {
  const assets: ExampleFileAsset[] = [];

  const primaryAsset = createExampleFileAsset(primary.component, Path.basename(primaryFileName), primary.example.title);
  assets.push(primaryAsset, ...createTemplateAndStyleExampleFileAsset(primary));

  if (primary.example.additionalFiles?.length) {
    assets.push(...primary.example.additionalFiles.map( f => createExampleFileAsset('', Path.basename(f)) ));
  }
  if (Array.isArray(primary.secondaries)) {
    for (const sec of primary.secondaries) {
      assets.push(...createTemplateAndStyleExampleFileAsset(sec));
    }
  }
  return assets;
}

function createTemplateAndStyleExampleFileAsset(parsedCmp: ParsedComponentMetadata) {
  const assets: ExampleFileAsset[] = [];
  const { component, templateUrl, styleUrls } = parsedCmp;

  if (templateUrl) {
    assets.push(createExampleFileAsset(component, templateUrl));
  }
  if (Array.isArray(styleUrls)) {
    assets.push(...styleUrls.map( styleFile => createExampleFileAsset(component, styleFile)));
  }
  return assets;
}

function createExampleFileAsset(parent: string, file: string, title?: string): ExampleFileAsset {
  return {
    parent,
    file,
    title: title || file,
    lang: extractLangFromFileName(file),
    source: '',
    contents: '',
  };
}
