// tslint:disable:use-host-property-decorator

import { Directive, TemplateRef, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { NegTableComponent } from '../table.component';
import { NegTableMetaCellContext } from '../context/types';
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

export interface NegTableDataHeaderExtensionRef extends NegTableMultiTemplateRegistry<NegTableMetaCellContext<any>, 'dataHeaderExtensions'> {
  shouldRender?(context: NegTableMetaCellContext<any>): boolean;
}

/**
 * Marks the element as the display element for pagination
 */
@Directive({
  selector: '[negTableOuterSection]',
  inputs: [ 'position:negTableOuterSection' ] // tslint:disable-line:use-input-property-decorator
})
export class NegTableOuterSectionDirective implements AfterViewInit {

  position: 'top' | 'bottom'; // tslint:disable-line:no-input-rename

  constructor(private table: NegTableComponent<any>, private tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>) { }

  ngAfterViewInit(): void {
    this.table.createView(this.position === 'bottom' ? 'beforeContent' : 'beforeTable', this.tRef);
  }
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
 *   <neg-table>
 *     <div *negTableNoDataRef style="height: 100%; display: flex; align-items: center; justify-content: center">
 *       <span>No Data</span>
 *     </div>
 *   </neg-table>
 * ```
 */
@Directive({ selector: '[negTableNoDataRef]' })
export class NegTableNoDataRefDirective extends NegTableSingleTemplateRegistry<{ $implicit: NegTableComponent<any> }, 'noData'> {
  readonly kind: 'noData' = 'noData';
  constructor(tRef: TemplateRef<{ $implicit: NegTableComponent<any> }>, registry: NegTableRegistryService) { super(tRef, registry); }
}
