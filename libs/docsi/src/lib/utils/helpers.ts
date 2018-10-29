
import { SourceCodeRef } from '@neg/docsi/webpack';

export function normalizeExtractCode(code: SourceCodeRef[]): SourceCodeRef[] {
  if (!code) {
    return [];
  }

  // handle es6 default exports
  if (!Array.isArray(code) && (code && Array.isArray((<any> code)['default'])) ) {
    return  (<any> code)['default'];
  } else if (!Array.isArray(code)) {
    throw new Error(`Invalid ExtrectCode input, value must be an array, got ${stringify(code)}`);
  }
  return code;
}

/**
 * See https://github.com/angular/angular/blob/2.0.0-rc.4/modules/%40angular/facade/src/lang.ts#L149
 * @param token
 * @returns
 */
export function stringify(token: { name?: string; overriddenName?: string } & any): string {
  if (typeof token === 'string') {
    return token;
  }

  if (token === undefined || token === null) {
    return '' + token;
  }

  if (token.name) {
    return token.name;
  }
  if (token.overriddenName) {
    return token.overriddenName;
  }

  const res = token.toString();
  const newLineIndex = res.indexOf('\n');
  return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}

export function LazyInit(getter: Function): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      throw new Error('LazyInit can only decorate properties');
    }
    Object.defineProperty(target, propertyKey, {
      get() {
        const ret = getter.call(this);

        Object.defineProperty(this, propertyKey, { value: ret });
        return ret;
      }
    });
  };
}
