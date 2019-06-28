import { ComponentRef, Type } from '@angular/core';
import { ComponentPortal, CdkPortalOutletAttachedRef } from '@angular/cdk/portal';

export abstract class MarkdownDynamicComponentPortal {
  selectedPortal: ComponentPortal<any>;
  ref: CdkPortalOutletAttachedRef;

  componentName: string;
  inputParams: any;
  containerClass: string;

  abstract getComponent(selector: string): Type<any> | undefined;

  render(): void {
    const component = this.getComponent(this.componentName);
    if (component) {
      this.selectedPortal = new ComponentPortal(component);
    } else {
      console.error(`Could not render a component portal, component "${this.componentName}" was not found.`);
    }
  }

  attached(event: CdkPortalOutletAttachedRef): void {
    this.ref = event;
    if (this.ref && this.inputParams && this.ref instanceof ComponentRef) {
      Object.assign(this.ref.instance, this.inputParams);
    }
  }
}
