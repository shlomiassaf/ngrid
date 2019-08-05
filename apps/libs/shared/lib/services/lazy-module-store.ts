import { Subject, Observable } from 'rxjs';
import { Injectable, NgModuleRef, Type } from '@angular/core';

export interface LazyModuleInitEvent<T> {
  module: Type<T>;
  ngModule?: NgModuleRef<T>;
  error?: Error;
};

@Injectable({ providedIn: 'root' })
export class LazyModuleStoreService {

  readonly moduleInit: Observable<LazyModuleInitEvent<any>>;
  private _moduleInit = new Subject<LazyModuleInitEvent<any>>();
  private cache = new Map<Type<any>, NgModuleRef<any>>();

  constructor() {
    this.moduleInit = this._moduleInit.asObservable();
  }

  has(module: Type<any>): boolean {
    return this.cache.has(module);
  }

  get<T>(module: Type<T>): NgModuleRef<T> {
    return this.cache.get(module);
  }

  moduleRegistered(event: LazyModuleInitEvent<any>): void {
    this.cache.set(event.module, event.ngModule);
    this._moduleInit.next(event);
  }

}
