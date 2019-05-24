export function removeFromArray<T = any>(arr: T[], predicate: (value: T, index?: number) => boolean): boolean;
export function removeFromArray<T = any>(arr: T[], value: T): boolean;
export function removeFromArray<T = any>(arr: T[], values: T[]): boolean[];
export function removeFromArray<T = any>(arr: T[], value: T | T[] | ((value: T, index?: number) => boolean)): boolean | boolean[] {
  if (Array.isArray(value)) {
    return value.map( v => _removeFromArray(arr, v) );
  } else if (typeof value === 'function') {
    const idx = arr.findIndex(value as any);
    if (idx > -1) {
      arr.splice(idx, 1);
      return true;
    } else {
      return false;
    }
  } else {
    return _removeFromArray<T>(arr, value);
  }
}

function _removeFromArray<T = any>(arr: T[], value: T): boolean {
  const idx = arr.indexOf(value);
  if (idx > -1) {
    arr.splice(idx, 1);
    return true;
  } else {
    return false;
  }
}
