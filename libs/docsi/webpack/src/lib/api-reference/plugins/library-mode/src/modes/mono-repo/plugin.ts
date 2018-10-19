import '../../../../typedoc-patchs/src/patching';
import * as Path from 'path';
import * as FS from 'fs';
import * as ts from 'typedoc/node_modules/typescript';

import { Reflection, ReflectionKind } from 'typedoc';
import { ConverterComponent } from 'typedoc/dist/lib/converter/components';
import { Converter } from 'typedoc/dist/lib/converter/converter';
import { Context } from 'typedoc/dist/lib/converter/context';

import { MonoRepo, MonoRepoPackage } from './models';
import { getDependencies, getSymbolSourceFile } from '../../../../utils';
import { createSymbolToReflectionMatcher } from '../symbols';
import { enforcePublicApiExports, sortContainersByDependency } from '../public-api-enforcer';

const NPM_SCOPE_RE = /^@(.+?)\/(.+)$/;

export class MonoRepoLibraryPlugin extends ConverterComponent {

  private monoRepo: MonoRepo;

  constructor(o: Converter, public enforcePublicApi: string[] | boolean) {
    super(o);
  }

  initialize() {
    this.monoRepo = new MonoRepo();

    this.listenTo(this.owner, {
      [Converter.EVENT_FILE_BEGIN]:           this.onBeginDocument,
      [Converter.EVENT_RESOLVE_BEGIN]:        this.onBeginResolve,
      [Converter.EVENT_RESOLVE_END]:          this.onEndResolve
    });
  }

  private onBeginDocument(context: Context, reflection: Reflection, node?: ts.SourceFile) {
    if (node) {
      this.listenToOnce(this.owner, Converter.EVENT_CREATE_DECLARATION, this.onDeclaration);
    }
  }

  /**
   * Triggered when the converter has created a declaration reflection.
   *
   * @param context  The context object describing the current state the converter is in.
   * @param reflection  The reflection that is currently processed.
   * @param node  The node that is currently processed if available.
   */
  private onDeclaration(context: Context, reflection: Reflection, node: ts.SourceFile) {
    if (reflection.kindOf(ReflectionKind.ExternalModule)) {
      const pkg = this.monoRepo.bindReflection(node, reflection);
      const graph = pkg.depGraph[node.fileName] = [];

      getDependencies(node, context.checker as any).forEach(importSymbol => {
        const sf = getSymbolSourceFile(importSymbol);
        graph.push(sf.fileName);
      });
    }
  }


  /**
   * Triggered when the converter begins resolving a project.
   *
   * @param context  The context object describing the current state the converter is in.
   */
  private onBeginResolve(context: Context) {
    this.monoRepo.packages.forEach( pkg => {
      const sortedContainers = sortContainersByDependency(<any> pkg.modules, pkg.depGraph);

      const root = sortedContainers.shift();
      if (!root.children) {
        root.children = [];
      }
      pkg.rootModule = <any> root;

      const packageInfo = JSON.parse(FS.readFileSync(Path.join(pkg.rootDir, 'package.json'), 'utf-8'));
      pkg.rootModule.name = packageInfo.name;

      // Process each rename
      sortedContainers.forEach( item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((ref: Reflection) => {
            // update links in both directions
            ref.parent = root;
            root.children.push(<any> ref);
          });
          item.children.length = 0;
        }
        context.removeReflection(<any> item);
      });


    });
  }

  /**
   * Triggered when the converter has finished resolving a project.
   *
   * @param context  The context object describing the current state the converter is in.
   */
  private onEndResolve(context: Context) {
    if (!this.enforcePublicApi) {
      return;
    }

    let packages: MonoRepoPackage[];
    if (this.enforcePublicApi === true) {
      packages = this.monoRepo.packages;
    } else {
      const enforcePublicApi: string[] = <any> this.enforcePublicApi;
      packages = [];
      this.monoRepo.packages
        .forEach( pkg => {
          if ( enforcePublicApi.indexOf(pkg.rootModule.originalName) > -1 ) {
            packages.push(pkg);
          } else {
            context.removeReflection(<any> pkg.rootModule, true);
          }
        });
    }

    const matcher = createSymbolToReflectionMatcher(context);
    packages.forEach( pkg => {
      matcher.changeContext(context, pkg.rootModule);
      const fileSymbol = matcher.getFileSymbolFromPath(pkg.rootModule.originalName);
      const symbols =  <any> context.checker.getExportsOfModule(<any> fileSymbol);
      enforcePublicApiExports(matcher, symbols, pkg.rootModule);

      const match = NPM_SCOPE_RE.exec(pkg.rootModule.name);
      if (match) {
        context.project.name = match[1];
        pkg.rootModule.name =  match[2];
      }
    });
  }
}
