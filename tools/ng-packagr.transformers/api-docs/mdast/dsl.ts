import './mdast';
import { MdTypeMap } from 'mdast';

export type ArrayType<T> = T extends (infer U)[] ? U : any;
export type Omit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export type NonParentMdTypeKeys = { [P in keyof MdTypeMap]: keyof MdTypeMap[P] & 'children' extends never ? P : never; }[keyof MdTypeMap];
export type NonParentMdTypeMap = Pick<MdTypeMap, NonParentMdTypeKeys>;

export type ParentMdTypeKeys = { [P in keyof MdTypeMap]: keyof MdTypeMap[P] & 'children' extends never ? never : P; }[keyof MdTypeMap];
export type ParentMdTypeMap = Pick<MdTypeMap, ParentMdTypeKeys>;

export function m<T extends NonParentMdTypeKeys>(type: T, props: Omit<NonParentMdTypeMap[T], 'type'>): NonParentMdTypeMap[T];
export function m<T extends ParentMdTypeKeys>(type: T, props: Omit<ParentMdTypeMap[T], 'type' | 'children'>, children?: Array<ArrayType<ParentMdTypeMap[T]['children']>>): ParentMdTypeMap[T];
export function m<T extends keyof MdTypeMap>(type: T, props: MdTypeMap[T], children?: any[]): MdTypeMap[T] {
  return { ...props, type, ...(children ? { children } : {}) };
}
