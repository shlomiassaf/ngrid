// tslint:disable:use-host-property-decorator

import { Directive, TemplateRef, OnInit, OnDestroy, ComponentFactory, ComponentRef, Injector, Input } from '@angular/core';

import { PblColumn } from '../columns/column';
import { PblNgridComponent } from '../ngrid.component';
import { MetaCellContext, PblNgridMetaCellContext } from '../context/index';
import { PblNgridHeaderCellComponent } from './cell';
import { PblNgridSingleRegistryMap, PblNgridMultiRegistryMap, PblNgridRegistryService } from '../services/grid-registry.service';

export abstract class PblNgridSingleTemplateRegistry<T, TKind extends keyof PblNgridSingleRegistryMap> implements OnInit, OnDestroy {
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: PblNgridRegistryService) { }

  ngOnInit(): void {
    this.registry.setSingle(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle(this.kind,  undefined);
  }
}

export abstract class PblNgridMultiTemplateRegistry<T, TKind extends keyof PblNgridMultiRegistryMap> implements OnInit, OnDestroy {
  abstract readonly name: string;
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: PblNgridRegistryService) { }

  ngOnInit(): void {
    this.registry.addMulti(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.removeMulti(this.kind, this as any);
  }
}

export abstract class PblNgridMultiComponentRegistry<T, TKind extends keyof PblNgridMultiRegistryMap> {
  abstract readonly name: string;
  abstract readonly kind: TKind;

  /**
   * When set to true the component will be created with projected content.
   * Setting to true does not ensure projection, the projection is determined by the context creating the component.
   *
   * For example, In the context of `dataHeaderExtensions` the projection will be the content of the cell, other implementations
   * might not include a projection.
   */
  readonly projectContent?: boolean;

  abstract getFactory(context: PblNgridMetaCellContext<any, PblColumn>): ComponentFactory<T>;
  onCreated?(context: PblNgridMetaCellContext<any, PblColumn>, cmpRef: ComponentRef<T>): void;
}

export class PblNgridDataHeaderExtensionContext<T = any> extends MetaCellContext<T, PblColumn> {
  readonly injector: Injector

  protected constructor() { super(); }

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static createDateHeaderCtx<T = any>(headerCell: PblNgridHeaderCellComponent<PblColumn>, injector: Injector): PblNgridDataHeaderExtensionContext<T> {
    const instance = new PblNgridDataHeaderExtensionContext<T>();

    instance.col = headerCell.columnDef.column;
    instance.grid = headerCell.grid;
    Object.defineProperty(instance, 'injector', { value: injector });
    return instance;
  }
}

export interface PblNgridDataHeaderExtensionRef<T = any> {
  shouldRender?(context: PblNgridDataHeaderExtensionContext<T>): boolean;
}


/**
 * A generic, multi-purpose template reference for data header extensions.
 * The template's context is `PblNgridDataHeaderExtensionContext`:
 *
 * ```ts
 * interface PblNgridDataHeaderExtensionContext {
 *   col: PblMetaColumn;
 *   grid: PblNgridComponent<any>;
 *   injector: Injector;
 * }
 * ```
 *
 * By default it will render if registered but it is possible to provide a predicate to conditionally load it.
 *
 * ```html
 * <div *pblNgridHeaderExtensionRef="let ctx"></div>
 * ````
 *
 * Or with a `shouldRender` predicate:
 *
 * ```html
 * <div *pblNgridHeaderExtensionRef="shouldRender; let ctx"></div>
 * ```
 *
 * And in the component the template is defined on:
 *
 * ```ts
 * class MyComponent {
 *
 *   shouldRender = (context: PblNgridDataHeaderExtensionContext) => {
 *     // Some code returning true or false
 *   }
 * }
 * ```
 *
 * Note that the `shouldRender` predicate is run once when the header initialize.
 */
@Directive({ selector: '[pblNgridHeaderExtensionRef]' })
export class PblNgridHeaderExtensionRefDirective extends PblNgridMultiTemplateRegistry<PblNgridDataHeaderExtensionContext, 'dataHeaderExtensions'> implements PblNgridDataHeaderExtensionRef {
  private static _id = 0;

  readonly name: string = 'genericHeaderExtension-' + PblNgridHeaderExtensionRefDirective._id++;
  readonly kind: 'dataHeaderExtensions' = 'dataHeaderExtensions';

  @Input('pblNgridHeaderExtensionRef') shouldRender?: (context: PblNgridDataHeaderExtensionContext) => boolean;

  constructor(tRef: TemplateRef<PblNgridDataHeaderExtensionContext>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

/**
 * Marks the element as the display element for pagination
 */
@Directive({ selector: '[pblNgridPaginatorRef]' })
export class PblNgridPaginatorRefDirective extends PblNgridSingleTemplateRegistry<{ $implicit: PblNgridComponent<any> }, 'paginator'> {
  readonly kind: 'paginator' = 'paginator';
  constructor(tRef: TemplateRef<{ $implicit: PblNgridComponent<any> }>, registry: PblNgridRegistryService) { super(tRef, registry); }
}

/**
 * Marks the element as the display element when grid has no data.
 *
 * @example
 * ```html
 *   <pbl-ngrid>
 *     <div *pblNgridNoDataRef style="height: 100%; display: flex; align-items: center; justify-content: center">
 *       <span>No Data</span>
 *     </div>
 *   </pbl-ngrid>
 * ```
 */
@Directive({ selector: '[pblNgridNoDataRef]' })
export class PblNgridNoDataRefDirective extends PblNgridSingleTemplateRegistry<{ $implicit: PblNgridComponent<any> }, 'noData'> {
  readonly kind: 'noData' = 'noData';
  constructor(tRef: TemplateRef<{ $implicit: PblNgridComponent<any> }>, registry: PblNgridRegistryService) { super(tRef, registry); }
}
