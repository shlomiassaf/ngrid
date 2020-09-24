import { Fragment } from './fragment';

export enum IntersectionType {
  /** No intersection between "source" and "target" */
  none,
  /** "source" and "target" are equal */
  full,
  /** "target" contains the entire "source" */
  contained,
  /** "source" contains the entire "target" */
  contains,
  /** A portion from the "source" is not intersected with the "target" */
  partial,
}

export function intersect(f1: Fragment, f2: Fragment): Fragment | null {
  const min = f1.start < f2.start ? f1 : f2;
  const max = min === f1 ? f2 : f1;
  return min.end < max.start
    ? null
    : new Fragment(max.start, min.end < max.end ? min.end : max.end);
}

export function findIntersectionType(source: Fragment, target: Fragment, intersection?: ReturnType<typeof intersect>): IntersectionType {
  if (source.equals(target)) {
    return IntersectionType.full;
  }

  if (intersection === undefined) {
    intersection = intersect(source, target);
  }

  if (!intersection) {
    return IntersectionType.none;
  }

  if (source.equals(intersection)) {
    return IntersectionType.contained;
  }

  if (target.equals(intersection)) {
    return IntersectionType.contains;
  }

  return IntersectionType.partial;
}
