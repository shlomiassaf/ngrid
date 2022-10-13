import { BehaviorSubject, timer, race } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';
import { ComponentRef, Inject, INJECTOR, Injector, Type } from '@angular/core';
import { ComponentPortal, CdkPortalOutletAttachedRef } from '@angular/cdk/portal';
import { Directionality } from '@angular/cdk/bidi';
import { unrx } from '@pebula/ngrid/core';
import { LazyModuleStoreService } from '../services/lazy-module-store';

const COMPONENT_WAIT_TIMEOUT = 1000 * 60; // 60 secs

export abstract class MarkdownDynamicComponentPortal {
  selectedPortal$ = new BehaviorSubject<ComponentPortal<any>>(null);
  get selectedPortal(): ComponentPortal<any> { return this.selectedPortal$.value; }

  ref: CdkPortalOutletAttachedRef;

  componentName: string;
  inputParams: any;
  containerClass: string;

  constructor(@Inject(INJECTOR) private _injector: Injector) {  }

  abstract getRenderTypes(selector: string): { component?: Type<any>; moduleType?: Type<any>; } | undefined;

  render(): void {
    unrx.kill(this, 'render');
    const { component, moduleType } = this.getRenderTypes(this.componentName) || <any>{};
    const lazyModuleStore = this._injector.get(LazyModuleStoreService, null);
    if (component) {
      const ngModule = lazyModuleStore?.get(moduleType);
      const injector = Injector.create({
        providers: [{ provide: Directionality, useValue: this._injector.get(Directionality) }],
        parent: ngModule?.injector
      });
      // TODO: deprecate ComponentFactoryResolver once done in @angular/components
      this.selectedPortal$.next(new ComponentPortal(component, null, injector, ngModule?.componentFactoryResolver));
    } else {
      this.selectedPortal$.next(null);
      if (lazyModuleStore) {
        const timeout = {};
        const time$ = timer(COMPONENT_WAIT_TIMEOUT).pipe(mapTo(timeout), unrx(this, 'render'));
        const init$ = lazyModuleStore.moduleInit.pipe(
          filter( () => !!this.getRenderTypes(this.componentName) ),
          unrx(this, 'render')
        );

        race(init$, time$)
          .pipe(unrx(this, 'render'))
          .subscribe( event => {
            if (event === timeout) {
              this.logCantRender();
            } else {
              this.render();
            }
          });

      } else {
        this.logCantRender();
      }
    }
  }

  attached(event: CdkPortalOutletAttachedRef): void {
    this.ref = event;
    if (this.ref && this.inputParams && this.ref instanceof ComponentRef) {
      Object.assign(this.ref.instance, this.inputParams);
    }
  }

  private logCantRender(): void {
    console.error(`Could not render a component portal, component "${this.componentName}" was not found.`);
  }
}
