import { Type } from '@angular/core';

export interface LiveExample {
  title: string;
  moduleType?: Type<any>;
  component?: any;
  additionalFiles?: string[];
  selectorName?: string;
}

export const EXAMPLE_COMPONENT_LIST: Type<any>[] = [];
export const EXAMPLE_COMPONENTS: {[key: string]: LiveExample} = { };
export const COMPONENTS_EXAMPLES = new Map<Type<any>, LiveExample>();

export function Example(selector: string, metadata: LiveExample) {
  return target => {
    metadata.component = target;
    metadata.selectorName = selector;
    EXAMPLE_COMPONENTS[selector] = metadata;
    COMPONENTS_EXAMPLES.set(target, metadata);
    EXAMPLE_COMPONENT_LIST.push(target);
  }
}

export function BindNgModule(...components: Array<Type<any>>) {
  return target => {
    bindNgModule(target, ...components);
  }
}

export function bindNgModule(moduleType: Type<any>, ...components: Array<Type<any>>) {
  for (const c of components) {
    COMPONENTS_EXAMPLES.get(c).moduleType = moduleType;
  }
  return components;
}
