import * as ts from 'typedoc/node_modules/typescript';

import { Reflection, ReflectionKind} from "typedoc/dist/lib/models/reflections/abstract";
import { ConverterComponent} from "typedoc/dist/lib/converter/components";
import { Converter} from "typedoc/dist/lib/converter/converter";
import { Context} from "typedoc/dist/lib/converter/context";
import { ContainerReflection} from "typedoc/dist/lib/models/reflections/container";

import { getDependencies, getSymbolSourceFile } from '../../../../utils';
import { createSymbolToReflectionMatcher } from '../symbols';
import { enforcePublicApiExports, sortContainersByDependency } from '../public-api-enforcer';

export class StandaloneModeLibraryPlugin extends ConverterComponent {

  private containers: ContainerReflection[];
  private sortedContainers: ContainerReflection[];
  private depGraph: { [key: string]: string[] };

  constructor(o: Converter,
              public enforcePublicApi: string[] | boolean,
              public standaloneMode: string | false) {
    super(o);
  }

  initialize() {
    this.listenTo(this.owner, {
      [Converter.EVENT_FILE_BEGIN]:           this.onBeginDocument,
      [Converter.EVENT_RESOLVE_BEGIN]:        this.onBeginResolve,
      [Converter.EVENT_RESOLVE_END]:          this.onEndResolve
    });

    this.containers = [];
    this.depGraph = {} as any;
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
      const graph = this.depGraph[node.fileName] = [];
      this.containers.push(reflection as ContainerReflection);
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
  private onBeginResolve(context:Context) {
    let projRefs = context.project.reflections;
    let refsArray: Reflection[] = Object.keys(projRefs).reduce((m,k) => {m.push(projRefs[k]); return m;}, []);

    this.sortedContainers = sortContainersByDependency(this.containers, this.depGraph);

    // Process each rename
    this.sortedContainers.forEach(item => {
      const moduleMode = this.standaloneMode !== false;
      let target: ContainerReflection;

      // module mode means we have a module set by the user, it also allow multiple modules.
      if (moduleMode) {
        // Find an existing module that already has the "rename to" name.  Use it as the merge target.
        target = refsArray.filter(ref => ref.kind === item.kind && ref.name === this.standaloneMode)[0] as ContainerReflection;

        if (!target) {
          item.name = <any>this.standaloneMode;
          return;
        } else  if (!target.children) {
          target.children = [];
        }
      } else {
        target = context.project;
      }

      let childrenOfRenamed = refsArray.filter(ref => ref.parent === item);
      childrenOfRenamed.forEach((ref: Reflection) => {
        // update links in both directions
        ref.parent = target;
        target.children.push(<any> ref);
      });

      // Now that all the children have been relocated to the mergeTarget, delete the empty module
      // Make sure the module being renamed doesn't have children, or they will be deleted
      if (item.children) {
        item.children.length = 0;
      }

      context.removeReflection(<any> item);
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

    const entryPoints: string[] = this.enforcePublicApi === true
      ? [this.sortedContainers[0].originalName]
      : <any> this.enforcePublicApi
    ;

    entryPoints.forEach( entryPointPath => {
      const matcher = createSymbolToReflectionMatcher(context);
      const fileSymbol = matcher.getFileSymbolFromPath(entryPointPath);
      const symbols =  <any> context.checker.getExportsOfModule(<any> fileSymbol);
      enforcePublicApiExports(matcher, symbols);
    });
  }
}
