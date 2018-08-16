/**
 * Remove the variants of the second union of string literals from
 * the first.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 */
export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T];

/**
 * Drop keys `K` from `T`.
 *
 * @see https://github.com/pelotom/type-zoo
 * @see https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 */
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

/**
 * Like `T & U`, but where there are overlapping properties using the
 * type from U only.
 *
 * @see https://github.com/pelotom/type-zoo
 * @see https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 */
export type Overwrite<T, U> = Omit<T, Diff<keyof T, Diff<keyof T, keyof U>>> &  U;
