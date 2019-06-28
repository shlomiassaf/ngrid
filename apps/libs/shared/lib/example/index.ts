
export interface LiveExample {
  title: string;
  component?: any;
  additionalFiles?: string[];
  selectorName?: string;
}

export const EXAMPLE_LIST = [ ]

export const EXAMPLE_COMPONENTS: {[key: string]: LiveExample} = { };

export function Example(selector: string, metadata: LiveExample) {
  return target => {
    metadata.component = target;
    EXAMPLE_COMPONENTS[selector] = metadata;
  }
}
