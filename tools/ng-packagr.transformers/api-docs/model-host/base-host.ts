export abstract class BaseModelHost<T> {
  abstract toJson(): T;
}