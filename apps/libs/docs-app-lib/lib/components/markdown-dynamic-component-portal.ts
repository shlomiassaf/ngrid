import { BehaviorSubject, timer, race } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';
import { ComponentRef, Type } from '@angular/core';
import { ComponentPortal, CdkPortalOutletAttachedRef } from '@angular/cdk/portal';
import { utils } from '@pebula/ngrid';
import { LazyModuleStoreService } from '../services/lazy-module-store';

const COMPONENT_WAIT_TIMEOUT = 1000 * 60; // 60 secs

export abstract class MarkdownDynamicComponentPortal {
  selectedPortal$ = new BehaviorSubject<ComponentPortal<any>>(null);
  get selectedPortal(): ComponentPortal<any> { return this.selectedPortal$.value; }

  ref: CdkPortalOutletAttachedRef;

  componentName: string;
  inputParams: any;
  containerClass: string;

  constructor(private lazyModuleStore?: LazyModuleStoreService) {  }

  abstract getRenderTypes(selector: string): { component?: Type<any>; moduleType?: Type<any>; } | undefined;

  render(): void {
    utils.unrx.kill(this, 'render');
    const { component, moduleType } = this.getRenderTypes(this.componentName) || <any>{};
    if (component) {
      const ngModule = this.lazyModuleStore && this.lazyModuleStore.get(moduleType);
      const injector = ngModule ? ngModule.injector : null;
      const componentFactoryResolver = ngModule ? ngModule.componentFactoryResolver : null;
      this.selectedPortal$.next(new ComponentPortal(component, null, injector, componentFactoryResolver));
    } else {
      this.selectedPortal$.next(null);
      if (this.lazyModuleStore) {
        const timeout = {};
        const time$ = timer(COMPONENT_WAIT_TIMEOUT).pipe(mapTo(timeout), utils.unrx(this, 'render'));
        const init$ = this.lazyModuleStore.moduleInit.pipe(
          filter( () => !!this.getRenderTypes(this.componentName) ),
          utils.unrx(this, 'render')
        );

        race(init$, time$)
          .pipe(utils.unrx(this, 'render'))
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
