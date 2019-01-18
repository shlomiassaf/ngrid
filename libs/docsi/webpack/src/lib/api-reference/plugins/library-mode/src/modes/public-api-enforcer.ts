const toposort = require('toposort');
import * as ts from 'typescript';
import { ContainerReflection, Reflection, ReflectionKind } from 'typedoc';
import { findAncestorOfKind, kindOfFamily } from '../../../utils';

export function enforcePublicApiExports(matcher,
                                        symbols: ts.Symbol[],
                                        ...forceExport: Array<Reflection>): void {
  if (symbols) {
    const exported = matcher.getExportedReflectionsFromSymbols(symbols);
    matcher.traverseDeleteIf(exported, (r: Reflection, isExported: boolean, s?: ts.Symbol): boolean => {
      if (forceExport.indexOf(r) > -1) {
        return false;
      }
      if (isExported) {
        // NOT RELATED TO PREDICATE -> STATE CHANGING:
        // setting the exported name as the name (e.g. export x as y from 'z')
        // TODO: because at this point there might be ReferenceType instances that point to
        // this symbol reflection, it requires traversing and update.
        // TODO: move to different place.
        if (s && s.declarations
          && ts.isExportSpecifier(s.declarations[0])
          && (<ts.ExportSpecifier>s.declarations[0]).propertyName) {
          r.originalName = r.name;
          r.name = s.name;
        }

        // remove @angular private member convention
        // TODO: move to different place.
        if (s && s.name[0] === 'ɵ') {
          return true;
        }

        if (r.flags.isPrivate || r.flags.isProtected) {
          return true;
        }

        // remove @internal items
        // TODO: move to different place.
        if (r.comment && r.comment.hasTag('internal')) {
          return true;
        }

      } else {
        const extModule = findAncestorOfKind(r, ReflectionKind.ExternalModule);
        if (extModule) {
          if (extModule.originalName.includes('/node_modules')) {
            return false;
          }
        }
        return true;
      }
    }
    );
  }
}

/**
 * Sort all containers by dependency
 */
export function sortContainersByDependency(containers: ContainerReflection[],
  depGraph: { [key: string]: string[] }): ContainerReflection[] {
  const hasDependents = new Set<ContainerReflection>(containers);

  // find the container/s that no one depends on.
  containers.forEach( container => {
    const graphNodeKeys = depGraph[container.originalName];
    if (graphNodeKeys) {

      graphNodeKeys.forEach( nodeKey => {
        const node = containers.find( c => c.originalName === nodeKey );
        if (node && hasDependents.has(node)) {
          hasDependents.delete(node);
        }
      });
    }
  });

  // if > 1 sort by directory in path, lower better
  const withDependents: ContainerReflection[] = Array.from(hasDependents.values());
  if (withDependents.length > 1) {
    withDependents.sort( (a, b) => {
      const aLen = a.originalName.split('/').length;
      const bLen = b.originalName.split('/').length;
      if (aLen < bLen) { return -1; }
      if (aLen > bLen) { return 1; }
      return 0;
    });
  }

  const circ = new Set<ContainerReflection>();
  const edges: any[] = [];
  let container: ContainerReflection;

  // connect edges
  while (container = withDependents.shift()) {
    if (!circ.has(container)) {
      circ.add(container); // protect
      const graphNodeKeys = depGraph[container.originalName];
      if (graphNodeKeys) {
        graphNodeKeys.forEach( nodeKey => {
          const node = containers.find( c => c.originalName === nodeKey );
          if (node && !circ.has(node)) {
            edges.push([container, node]);
            withDependents.push(node);
          }
        });
      }
    }
  }

  // sort he graph, ensure all containers exists even if they have no edge.
  return toposort.array(containers, edges);
}
