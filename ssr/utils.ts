import { Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ComponentCompileOptions } from './compiled-ng-module-host';

export function resolveOptions(options: ComponentCompileOptions, fallbackInjector: Injector): { injector: Injector; projectableNodes?: any[][]; } {
  const injector = resolveInjector(options, fallbackInjector);
  const projectableNodes = resolveProjectableNodes(options, injector);
  return { injector, projectableNodes };
}

function resolveProjectableNodes(options: ComponentCompileOptions, injector: Injector): any[][] | undefined {
  let projectableNodes: any[][];
  if (options.projectableNodes) {
    if (typeof options.projectableNodes === 'string') {
      // we don't use the dom implementation library directly (e.g. "domino"), we instead use whatever angular provides.
      projectableNodes = [ htmlToDom(injector.get(DOCUMENT), options.projectableNodes) ];
    } else {
      projectableNodes = options.projectableNodes;
    }
  }
  return projectableNodes;
}

function resolveInjector(options: ComponentCompileOptions, fallbackInjector: Injector): Injector {
  const injector = options.injector || fallbackInjector;
  if (Array.isArray(options.providers)) {
    return Injector.create({
      providers: options.providers,
      parent: injector,
    });
  } else {
    return injector;
  }
}

// We assume the DOM implementation support `HTMLTemplateElement`.
// Currently, angular uses `domino` which does support it and there is no reason to believe it will change in the future
// or that it will change to something without `HTMLTemplateElement` support.
function htmlToDom(document: Document, html: string): Node[] {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return Array.from(template.content.childNodes);
}
