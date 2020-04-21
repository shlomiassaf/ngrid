import { removeFromArray } from './array';

describe('removeFromArray', () => {
  let arr: number[];

  beforeEach(() => {
    arr = [1, 2, 3, 4, 5, 6, 7];
  });

  it('should be a function', () => {
    expect(typeof removeFromArray).toEqual('function');
  });

  it('should remove a single value', () => {
    expect(arr.length).toEqual(7);
    expect(removeFromArray(arr, 3)).toEqual(true);
    expect(arr.length).toEqual(6);
    expect(arr.indexOf(3)).toEqual(-1);

    expect(removeFromArray(arr, 3)).toEqual(false);
    expect(arr.length).toEqual(6);
  });

  it('should remove multiple values', () => {
    expect(arr.length).toEqual(7);
    expect(removeFromArray(arr, [3, 4, 5, 9])).toEqual([true, true, true, false]);
    expect(arr.length).toEqual(4);
    expect(arr.indexOf(3)).toEqual(-1);
    expect(arr.indexOf(4)).toEqual(-1);
    expect(arr.indexOf(5)).toEqual(-1);

    expect(removeFromArray(arr, 3)).toEqual(false);
    expect(arr.length).toEqual(4);
  });

  it('should remove with predicate', () => {
    expect(arr.length).toEqual(7);
    expect(removeFromArray(arr, v => v >= 3 && v <= 5)).toEqual(true);
    expect(arr.length).toEqual(6);
    expect(arr.indexOf(3)).toEqual(-1);

    expect(removeFromArray(arr, 3)).toEqual(false);
    expect(arr.length).toEqual(6);
  });

});
