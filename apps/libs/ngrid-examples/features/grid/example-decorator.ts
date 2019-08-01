import { Type } from '@angular/core';
import { Example as _Example, LiveExample } from '@pebula/apps/shared';

const GROUP_NAME = 'FeaturesGridExamplesModule';
_Example.defineGroup(GROUP_NAME);

export function Example(selector: string, metadata: LiveExample) {
  return target => {
    target = _Example(selector, metadata, GROUP_NAME)(target);
    return target;
  }
}

export namespace Example {
  export const bindModule = (moduleTypeToBind: Type<any>) => _Example.bindModule(moduleTypeToBind, GROUP_NAME);
}
