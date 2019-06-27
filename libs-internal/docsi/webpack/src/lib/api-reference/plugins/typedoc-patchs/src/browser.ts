export { ReflectionFlag, ReflectionKind } from 'typedoc';

declare module 'typedoc/dist/lib/models/reflections/abstract' {
  export enum ReflectionFlag {
    Abstract,
    Const,
    Let,
    Readonly
  }

  export interface ReflectionFlags {
    isAbstract?: boolean;
    isConst?: boolean;
    isLet?: boolean;
    isReadonly?: boolean;
  }
}
