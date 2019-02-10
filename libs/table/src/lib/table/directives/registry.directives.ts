// tslint:disable:use-host-property-decorator

import { Directive, TemplateRef, OnInit, OnDestroy, ComponentFactory, ComponentRef, Injector } from '@angular/core';

import { PblColumn } from '../columns/column';
import { PblTableComponent } from '../table.component';
import { MetaCellContext, PblTableMetaCellContext } from '../context/index';
import { PblTableHeaderCellComponent } from './cell';
import { PblTableSingleRegistryMap, PblTableMultiRegistryMap, PblTableRegistryService } from '../services/table-registry.service';

export abstract class PblTableSingleTemplateRegistry<T, TKind extends keyof PblTableSingleRegistryMap> implements OnInit, OnDestroy {
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: PblTableRegistryService) { }

  ngOnInit(): void {
    this.registry.setSingle(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle(this.kind,  undefined);
  }
}

export abstract class PblTableMultiTemplateRegistry<T, TKind extends keyof PblTableMultiRegistryMap> implements OnInit, OnDestroy {
  abstract readonly name: string;
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: PblTableRegistryService) { }

  ngOnInit(): void {
    this.registry.addMulti(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.removeMulti(this.kind, this as any);
  }
}

export abstract class PblTableMultiComponentRegistry<T, TKind extends keyof PblTableMultiRegistryMap> {
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

  abstract getFactory(context: PblTableMetaCellContext<any, PblColumn>): ComponentFactory<T>;
  onCreated?(context: PblTableMetaCellContext<any, PblColumn>, cmpRef: ComponentRef<T>): void;
}

export class PblTableDataHeaderExtensionContext<T = any> extends MetaCellContext<T, PblColumn> {
  constructor(headerCell: PblTableHeaderCellComponent<PblColumn>, public readonly injector: Injector) {
    super(headerCell.columnDef.column, headerCell.table);
  }
}

export interface PblTableDataHeaderExtensionRef<T = any> {
  shouldRender?(context: PblTableDataHeaderExtensionContext<T>): boolean;
}

/**
 * Marks the element as the display element for pagination
 */
@Directive({ selector: '[negTablePaginatorRef]' })
export class PblTablePaginatorRefDirective extends PblTableSingleTemplateRegistry<{ $implicit: PblTableComponent<any> }, 'paginator'> {
  readonly kind: 'paginator' = 'paginator';
  constructor(tRef: TemplateRef<{ $implicit: PblTableComponent<any> }>, registry: PblTableRegistryService) { super(tRef, registry); }
}

/**
 * Marks the element as the display element when table has no data.
 *
 * @example
 * ```html
 *   <pbl-table>
 *     <div *pblTableNoDataRef style="height: 100%; display: flex; align-items: center; justify-content: center">
 *       <span>No Data</span>
 *     </div>
 *   </pbl-table>
 * ```
 */
@Directive({ selector: '[negTableNoDataRef]' })
export class PblTableNoDataRefDirective extends PblTableSingleTemplateRegistry<{ $implicit: PblTableComponent<any> }, 'noData'> {
  readonly kind: 'noData' = 'noData';
  constructor(tRef: TemplateRef<{ $implicit: PblTableComponent<any> }>, registry: PblTableRegistryService) { super(tRef, registry); }
}
