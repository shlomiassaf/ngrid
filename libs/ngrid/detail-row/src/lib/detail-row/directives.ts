// tslint:disable:use-host-property-decorator
import {
  Component,
  Directive,
  OnInit,
  OnDestroy,
  TemplateRef,
  Input,
} from '@angular/core';

import { PblNgridRegistryService } from '@pebula/ngrid/core';
import { PblNgridSingleTemplateRegistry, PblNgridRowContext, PblNgridRowDef } from '@pebula/ngrid';

declare module '@pebula/ngrid/core/lib/registry/types' {
  interface PblNgridSingleRegistryMap {
    detailRowParent?: PblNgridDetailRowParentRefDirective<any>;
    detailRow?: PblNgridDetailRowDefDirective;
  }
}

export interface PblNgridDetailRowContext<T = any> {
  $implicit: T;
  rowContext: PblNgridRowContext<T>;
  animation: {
    /**
     * When true, indicates that the toggle (open/close) trigger of the detail row was from a rendering operation and not a user interaction.
     * For example, scrolling out of view or changing the row's context due to virtual scroll updates.
     *
     * This flag is here to note that allowing you to customize behavior, especially when using animation.
     * You should disable animations (angular & CSS) when the toggle came from a rendering operation and not from user click to prevent
     * flickering and strange behaviors with virtual scrolling.
     *
     * When using angular animation, you can use the `[@.disable]` binding to make sure no animations run (`[@.disable]="animation.fromRender"`)
     * or when using CSS animation, use a class to disable the animations.
     *
     * > If you're not using the dynamic virtual scroll or your animation is not changing the height, you can ignore this value.
     */
    fromRender: boolean;

    /**
     * Invoke this function to notify the grid that an animation operation has ended.
     * This is required when `hasAnimation` is turned on on the structural directive `pblNgridDetailRowDef`.
     * If hasAnimation is enabled and this function is not called the grid will not be able to measure the new height
     * of the detail row effecting virtual scroll calculations.
     *
     * You should call via angular`s animation events `(@.myTrigger.done)="animation.end()"` or if using CSS animations via `(animationend)="animation.end()"`
     *
     * > If you're not using the dynamic virtual scroll or your animation is not changing the height, you can ignore this value.
     */
    end: () => void;
  }
}

/**
 * Marks the element as the display element for the detail row itself.
 */
@Directive({ selector: '[pblNgridDetailRowDef]' })
export class PblNgridDetailRowDefDirective extends PblNgridSingleTemplateRegistry<PblNgridDetailRowContext, 'detailRow'> {
  readonly kind: 'detailRow' = 'detailRow';

  /**
   * Define the height measure strategy to use when the detail row is opened or closed.
   *
   * When we toggle the detail row we need to update the height so we can notify the dynamic virtual scroll to take this into account.
   * If we have a toggle animation, the height must be measured at the end of the animation otherwise we can measure it once the element is created.
   *
   * By not setting value (the default) or setting false, the measurement will take place immediately.
   * If we want to support animations we can apply 1 of 2 strategies:
   *
   * - `interaction` - If the toggle origin is from a user interaction (e.g. click) or a programmatic API then it WILL NOT
   *                   measure the height until `animation.end()` is called on the detail row context.
   *                   Otherwise, it will measure it immediately.
   *                   A Non-Interaction origin can happen from scrolling out of view or changing the row's context due to virtual scroll updates.
   *                   See `fromRender` on the context for more details.
   *                   I.E: When `fromRender` is true, the grid will measure the height immediately, otherwise it will wait for you to call `animation.end()`
   *
   * - `always` - Will always assume animation is running when toggling the detail row and WILL NOT measure the height
   *              until `animation.end()` is called on the detail row context.
   *
   * If you are using animation, we strongly suggest to use `interaction` mode!
   *
   * > If you're not using the dynamic virtual scroll or your animation is not changing the height, you can ignore this value.
   */
  // tslint:disable-next-line: no-input-rename
  @Input('pblNgridDetailRowDefHasAnimation') hasAnimation: 'always' | 'interaction' | false | undefined;

  constructor(tRef: TemplateRef<PblNgridDetailRowContext>, registry: PblNgridRegistryService) { super(tRef, registry); }

}

@Directive({
  selector: '[pblNgridDetailRowParentRef]',
  inputs: ['columns: pblNgridDetailRowParentRef', 'when: pblNgridDetailRowParentRefWhen'],
})
export class PblNgridDetailRowParentRefDirective<T> extends PblNgridRowDef<T> implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.registry.setSingle('detailRowParent', this as any);
  }

  ngOnDestroy(): void {
    if (this.registry.getSingle('detailRowParent') === this) {
      this.registry.setSingle('detailRowParent',  undefined);
    }
  }
}

/**
 * Use to set the a default `pblNgridDetailRowParentRef` if the user did not set one.
 * @internal
 */
@Component({
  selector: 'pbl-ngrid-default-detail-row-parent',
  template: `<pbl-ngrid-row *pblNgridDetailRowParentRef="let row;" detailRow></pbl-ngrid-row>`,
})
export class PblNgridDefaultDetailRowParentComponent { }
