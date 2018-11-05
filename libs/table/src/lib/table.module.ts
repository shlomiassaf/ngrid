import { ANALYZE_FOR_ENTRY_COMPONENTS, ComponentRef, Inject, InjectionToken, Injector, Type, Optional, NgModule, NgModuleRef, ModuleWithProviders, Self } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule as ScrollingModuleExp } from '@angular/cdk-experimental/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';

import {
  NEG_TABLE_CONFIG, NegTableConfig,
  NegTableRegistryService,
  NegCdkTableComponent,
  NegTableComponent,

  NegTableRowComponent,
  NegTableMetaRowContainerComponent, NegMetaRowDirective,
  NegTableColumnDef,
  NegTableHeaderCellDefDirective,
  NegTableFooterCellDefDirective,
  NegTableCellDefDirective, NegTableEditorCellDefDirective,
  NegTableHeaderCellComponent,
  NegTableCellDirective,
  NegTableFooterCellDirective,

  ParentNgStyleDirective, ParentNgClassDirective,
  NegTableOuterSectionDirective,
  NegTableNoDataRefDirective,
  NegTablePaginatorRefDirective,

  NegColumnSizeObserver,
  NegCdkVirtualScrollViewportComponent, NegCdkVirtualScrollDirective, NegTableScrolling,

  NegTableCellEditAutoFocusDirective,

  NegTableConfigService,
} from './table/index';
import { TableMetaCellContextPipe } from './table/pipes/table-cell-context.pipe';

export const COMMON_TABLE_TEMPLATE_INIT = new InjectionToken('COMMON TABLE TEMPLATE INIT');

export interface CommonTemplateInit {
  component: Type<any>;
  /**
   * When true will use the root registry service (for templates).
   * Otherwise, uses the provided registry from the dependency tree.
   */
  root?: boolean;
}

export function provideCommon(components: CommonTemplateInit[]): any {
  return [
    { provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: components },
    { provide: COMMON_TABLE_TEMPLATE_INIT, multi: true, useValue: components },
  ];
}

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule, ScrollingModuleExp,
    CdkTableModule,
  ],
  declarations: [
    NegTableMetaRowContainerComponent, NegMetaRowDirective,
    NegCdkTableComponent,
    NegTableColumnDef,
    NegTableRowComponent,
    ParentNgStyleDirective, ParentNgClassDirective,
    NegTableOuterSectionDirective,
    NegTableNoDataRefDirective,
    NegTablePaginatorRefDirective,

    NegTableHeaderCellDefDirective,
    NegTableFooterCellDefDirective,
    NegTableCellDefDirective, NegTableEditorCellDefDirective,
    NegTableHeaderCellComponent,
    NegTableCellDirective,
    NegTableFooterCellDirective,

    NegColumnSizeObserver,
    NegCdkVirtualScrollViewportComponent, NegCdkVirtualScrollDirective, NegTableScrolling,

    NegTableCellEditAutoFocusDirective,

    NegTableComponent,
    TableMetaCellContextPipe
  ],
  exports: [
    NegTableRowComponent,
    ParentNgStyleDirective, ParentNgClassDirective,
    NegTableOuterSectionDirective,
    NegTableNoDataRefDirective,
    NegTablePaginatorRefDirective,

    NegTableHeaderCellDefDirective,
    NegTableFooterCellDefDirective,
    NegTableCellDefDirective, NegTableEditorCellDefDirective, NegTableScrolling,
    NegTableHeaderCellComponent,
    NegTableCellDirective,
    NegTableFooterCellDirective,

    NegColumnSizeObserver,
    NegCdkVirtualScrollDirective,

    NegTableCellEditAutoFocusDirective,

    NegTableComponent,
  ],
})
export class NegTableModule {

  constructor(ngRef: NgModuleRef<any>,
              registry: NegTableRegistryService,
              @Inject(COMMON_TABLE_TEMPLATE_INIT) @Optional() @Self() components: CommonTemplateInit[][]) {
    if (components) {
      for (const multi of components) {
        for (const c of multi) {
          if (c.root) {
            registry = registry.getRoot();
          }
          NegTableModule.loadCommonTemplates(ngRef, c.component, { registry, destroy: true });
        }
      }
    }
  }

  static forRoot(config: NegTableConfig, components: CommonTemplateInit[]): ModuleWithProviders {
    return {
      ngModule: NegTableModule,
      providers: [
        { provide: NEG_TABLE_CONFIG, useValue: config },
        NegTableConfigService,
        provideCommon(components),
      ]
    };
  }

  static withCommon(components: CommonTemplateInit[]): ModuleWithProviders {
    return {
      ngModule: NegTableModule,
      providers: provideCommon(components),
    };
  }

  static loadCommonTemplates<T>(ngRef: NgModuleRef<any>,
                                component: Type<T>,
                                options?: {
                                  /** When set will use it as first registry in the DI tree */
                                  registry?: NegTableRegistryService;
                                  /** When set will destroy the component when the module is destroyed. */
                                  destroy?: boolean;
                                }): ComponentRef<T> {
    let { injector } = ngRef;
    const { registry, destroy } = options || ({} as any);

    if (registry) {
      injector = Injector.create({
        providers: [ { provide: NegTableRegistryService, useValue: registry.getRoot() } ],
        parent: ngRef.injector
      });
    }

    const cmpRef = ngRef.componentFactoryResolver.resolveComponentFactory<T>(component).create(injector);
    cmpRef.changeDetectorRef.detectChanges();

    if (destroy) {
      ngRef.onDestroy( () => {
        try {
          cmpRef.destroy();
        } catch( err) {}
      });
    }

    return cmpRef;
  }
}
