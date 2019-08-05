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

const moduleGroups = new Map<string, LiveExample[]>();

export function Example(selector: string, metadata: LiveExample, groupName?: string) {
  if (groupName) {
    moduleGroups.get(groupName).push(metadata);
  }

  return target => {
    metadata.component = target;
    metadata.selectorName = selector;
    EXAMPLE_COMPONENTS[selector] = metadata;
    COMPONENTS_EXAMPLES.set(target, metadata);
    EXAMPLE_COMPONENT_LIST.push(target);
  }
}

export namespace Example {
  export const clearGroup = (groupName: string) => moduleGroups.delete(groupName);
  export const defineGroup = (groupName: string) => moduleGroups.set(groupName, []);
  export const bindModule = (moduleTypeToBind: Type<any>, groupName: string) => {
    const coll = moduleGroups.get(groupName);
    for (const m of coll) {
      m.moduleType = moduleTypeToBind;
    }
    moduleGroups.set(groupName, [])
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
