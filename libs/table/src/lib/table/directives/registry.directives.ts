// tslint:disable:use-host-property-decorator

import { Directive, TemplateRef, OnInit, OnDestroy, ComponentFactory, ComponentRef, Injector } from '@angular/core';

import { NegColumn } from '../columns/column';
import { NegTableComponent } from '../table.component';
import { MetaCellContext, NegTableMetaCellContext } from '../context/index';
import { NegTableHeaderCellComponent } from './cell';
import { NegTableSingleRegistryMap, NegTableMultiRegistryMap, NegTableRegistryService } from '../services/table-registry.service';

export abstract class NegTableSingleTemplateRegistry<T, TKind extends keyof NegTableSingleRegistryMap> implements OnInit, OnDestroy {
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: NegTableRegistryService) { }

  ngOnInit(): void {
    this.registry.setSingle(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.setSingle(this.kind,  undefined);
  }
}

export abstract class NegTableMultiTemplateRegistry<T, TKind extends keyof NegTableMultiRegistryMap> implements OnInit, OnDestroy {
  abstract readonly name: string;
  abstract readonly kind: TKind;

  constructor(public tRef: TemplateRef<T>, protected registry: NegTableRegistryService) { }

  ngOnInit(): void {
    this.registry.addMulti(this.kind, this as any);
  }

  ngOnDestroy(): void {
    this.registry.removeMulti(this.kind, this as any);
  }
}

export abstract class NegTableMultiComponentRegistry<T, TKind extends keyof NegTableMultiRegistryMap> {
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

  abstract getFactory(context: NegTableMetaCellContext<any, NegColumn>): ComponentFactory<T>;
  onCreated?(context: NegTableMetaCellContext<any, NegColumn>, cmpRef: ComponentRef<T>): void;
}

export class NegTableDataHeaderExtensionContext<T = any> extends MetaCellContext<T, NegColumn> {
  constructor(headerCell: NegTableHeaderCellComponent<NegColumn>, public readonly injector: Injector) {
    super(headerCell.columnDef.column, headerCell.table);
  }
}

export interface NegTableDataHeaderExtensionRef<T = any> {
  shouldRender?(context: NegTableDataHeaderExtensionContext<T>): boolean;
}

/**
 * Marks the element as the display element for pagination
 */
@Directive({ selector: '[negTablePaginatorRef]' })
export class NegTablePaginatorRefDirective extends NegTableSingleTemplateRegistry<{ $implicit: NegTableComponent<any> }, 'paginator'> {
  readonly kind: 'paginator' = 'paginator';
  constructor(tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>, registry: NegTableRegistryService) { super(tRef, registry); }
}

/**
 * Marks the element as the display element when table has no data.
 *
 * @example
 * ```html
 *   <pbl-table>
 *     <div *negTableNoDataRef style="height: 100%; display: flex; align-items: center; justify-content: center">
 *       <span>No Data</span>
 *     </div>
 *   </pbl-table>
 * ```
 */
@Directive({ selector: '[negTableNoDataRef]' })
export class NegTableNoDataRefDirective extends NegTableSingleTemplateRegistry<{ $implicit: NegTableComponent<any> }, 'noData'> {
  readonly kind: 'noData' = 'noData';
  constructor(tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>, registry: NegTableRegistryService) { super(tRef, registry); }
}
