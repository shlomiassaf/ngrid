import { Observable, of, from, BehaviorSubject, Subject, isObservable } from 'rxjs';
import { switchMap, mapTo } from 'rxjs/operators';
import { Type, Inject, Injectable, NgModuleFactory, Compiler, NgModuleRef, InjectionToken } from '@angular/core';
import { Route, PreloadAllModules, LoadChildrenCallback } from '@angular/router';
import { LazyModuleInitEvent } from '@pebula/apps/shared';

export const LAZY_MODULE_PRELOADING_MAP = new InjectionToken<Route[]>('LAZY_MODULE_PRELOADING_MAP');

@Injectable()
export class LazyModulePreloader extends PreloadAllModules {
  cache = new Map<string, BehaviorSubject<null | LazyModuleInitEvent<any>>>();

  onCompile = new Subject<LazyModuleInitEvent<any>>();

  constructor(@Inject(LAZY_MODULE_PRELOADING_MAP) private preloadMap: Route[],
              private compiler: Compiler,
              private ngModule: NgModuleRef<any>) {
    super();
  }

  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    const r = this.preloadMap.find( s => s.path === route.path );
    if (r && typeof r.loadChildren === 'function') {
      if (!this.cache.has(route.path)) {
        const b = new BehaviorSubject<null | LazyModuleInitEvent<any>>(null);
        this.cache.set(route.path, b);

        let moduleType: Type<any>;

        wrapIntoObservable((<LoadChildrenCallback>r.loadChildren)())
          .pipe(
            switchMap( result => {
              if (result instanceof NgModuleFactory) {
                moduleType = result.moduleType;
                return of(result);
              } else {
                moduleType = result;
                return from(this.compiler.compileModuleAsync(result));
              }
            }),
          ).subscribe(
            factory => {
              const ngModule = factory.create(this.ngModule.injector);
              b.next({ module: factory.moduleType, ngModule });
              this.onCompile.next(b.getValue());
            },
            error => {
              b.next({ module: moduleType, error });
              this.onCompile.next(b.getValue());
            }
          );
      }
      return this.cache.get(route.path).pipe(mapTo(null));
    } else {
      return fn();
    }
  }
}

function isPromise(obj: any): obj is Promise<any> {
  return !!obj && typeof obj.then === 'function';
}

function wrapIntoObservable<T>(value: T | NgModuleFactory<T>| Promise<T>| Observable<T>) {
  if (isObservable(value)) {
    return value;
  }

  if (isPromise(value)) {
    return from(Promise.resolve(value));
  }

  return of(value);
}
