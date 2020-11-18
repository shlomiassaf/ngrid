import {
  ComponentRef,
  Inject,
  InjectionToken,
  Injector,
  Type,
  Optional,
  NgModule,
  NgModuleRef,
  ModuleWithProviders,
  Self,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule as ScrollingModuleExp } from '@angular/cdk-experimental/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';

/**
 * NOTE ABOUT IMPORTS
 *
 * DO NOT IMPORT FROM BARREL MODULES OR ANY MODULE THAT AGGREGATE AND EXPORT SYMBOLS
 * THE ANGULAR NGC COMPILER DOES NOT HANDLE IT WELL AND THE EXPORTED CODE MIGHT NOT WORK (METADATA ISSUE)
 *
 * THE CIRCULAR RUNTIME DETECTION DOES NOT WORK IN THIS CASE BECAUSE THERE IS NO ACTUAL CIRCULAR REFERENCE
 * IT HAPPENS BECAUSE OF THE WAY ANGULAR RE-BUILDS THE D.TS FILES AND METADATA FILES
 */
import { PblNgridRegistryService } from './grid/registry/registry.service';
import { PblCdkTableComponent }  from './grid/pbl-cdk-table/pbl-cdk-table.component';
import { PblNgridRowDef } from './grid/row/row-def.directive';
import { PblNgridRowComponent } from './grid/row/row.component';
import { PblNgridColumnRowComponent } from './grid/row/columns-row.component';
import { PblNgridMetaRowComponent } from './grid/row/meta-row.component';
import { PblNgridMetaRowContainerComponent } from './grid/meta-rows/meta-row-container';
import { PblMetaRowDirective } from './grid/meta-rows/meta-row.directive';
import { PblNgridColumnDef } from './grid/column/directives/column-def';
import { PblNgridHeaderCellDefDirective } from './grid/cell/cell-def/header-cell-def.directive';
import { PblNgridFooterCellDefDirective } from './grid/cell/cell-def/footer-cell-def.directive';
import { PblNgridCellDefDirective } from './grid/cell/cell-def/cell-def.directive';
import { PblNgridEditorCellDefDirective } from './grid/cell/cell-def/edit-cell-def.directive';
import { PblNgridHeaderCellComponent } from './grid/cell/header-cell.component';
import { PblNgridCellComponent } from './grid/cell/cell.component';
import { PblNgridFooterCellComponent } from './grid/cell/footer-cell.component';
import { PblNgridMetaCellComponent } from './grid/cell/meta-cell.component';
import { PblNgridCellEditAutoFocusDirective } from './grid/cell/cell-edit-auto-focus.directive';
import { PblNgridCellStyling } from './grid/cell/cell-styling.directive';
import { PblNgridOuterSectionDirective } from './grid/directives/directives';
import { PblNgridHeaderExtensionRefDirective } from './grid/registry/directives/data-header-extensions';
import { PblNgridNoDataRefDirective } from './grid/registry/directives/no-data-ref.directive';
import { PblNgridPaginatorRefDirective } from './grid/registry/directives/paginator-ref.directive';
import { PblNgridHideColumns } from './grid/features/hide-columns.directive';
import { PblCdkVirtualScrollViewportComponent } from './grid/features/virtual-scroll/virtual-scroll-viewport.component';
import { PblCdkVirtualScrollDirective } from './grid/features/virtual-scroll/strategies/v-scroll.directive';
import { PblNgridScrolling } from './grid/features/virtual-scroll/scrolling-plugin.directive';
import { PblNgridComponent } from './grid/ngrid.component';
import { PEB_NGRID_CONFIG, PblNgridConfig, PblNgridConfigService } from './grid/services/config';
import { PROVIDERS } from './di-factories';

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
    PblNgridMetaRowContainerComponent, PblMetaRowDirective,
    PblCdkTableComponent,
    PblNgridColumnDef,
    PblNgridRowDef, PblNgridRowComponent, PblNgridColumnRowComponent, PblNgridMetaRowComponent,
    PblNgridCellStyling,
    PblNgridOuterSectionDirective,
    PblNgridHeaderExtensionRefDirective,
    PblNgridNoDataRefDirective,
    PblNgridPaginatorRefDirective,
    PblNgridHeaderCellDefDirective,
    PblNgridFooterCellDefDirective,
    PblNgridCellDefDirective, PblNgridEditorCellDefDirective,
    PblNgridHeaderCellComponent,
    PblNgridCellComponent,
    PblNgridFooterCellComponent,
    PblNgridMetaCellComponent,

    PblNgridHideColumns,
    PblCdkVirtualScrollViewportComponent, PblCdkVirtualScrollDirective, PblNgridScrolling,

    PblNgridCellEditAutoFocusDirective,

    PblNgridComponent,
  ],
  providers: [
    ...PROVIDERS,
  ],
  exports: [
    PblNgridRowDef, PblNgridRowComponent, PblNgridColumnRowComponent, PblNgridMetaRowComponent,
    PblNgridCellStyling,
    PblNgridOuterSectionDirective,
    PblNgridHeaderExtensionRefDirective,
    PblNgridNoDataRefDirective,
    PblNgridPaginatorRefDirective,
    PblNgridHeaderCellDefDirective,
    PblNgridFooterCellDefDirective,
    PblNgridCellDefDirective, PblNgridEditorCellDefDirective, PblNgridScrolling,
    PblNgridHeaderCellComponent,
    PblNgridCellComponent,
    PblNgridFooterCellComponent,
    PblNgridMetaCellComponent,

    PblNgridHideColumns,
    PblCdkVirtualScrollDirective,

    PblNgridCellEditAutoFocusDirective,

    PblNgridComponent,
  ],
})
export class PblNgridModule {

  constructor(ngRef: NgModuleRef<any>,
              registry: PblNgridRegistryService,
              @Inject(COMMON_TABLE_TEMPLATE_INIT) @Optional() @Self() components: CommonTemplateInit[][]) {

    if (components) {
      for (const multi of components) {
        for (const c of multi) {
          if (c.root) {
            registry = registry.getRoot();
          }
          PblNgridModule.loadCommonTemplates(ngRef, c.component, { registry, destroy: true });
        }
      }
    }
  }

  static forRoot(config: PblNgridConfig, components: CommonTemplateInit[]): ModuleWithProviders<PblNgridModule> {
    return {
      ngModule: PblNgridModule,
      providers: [
        { provide: PEB_NGRID_CONFIG, useValue: config },
        PblNgridConfigService,
        provideCommon(components),
      ]
    };
  }

  static withCommon(components: CommonTemplateInit[]): ModuleWithProviders<PblNgridModule> {
    return {
      ngModule: PblNgridModule,
      providers: provideCommon(components),
    };
  }

  static loadCommonTemplates<T>(ngRef: NgModuleRef<any>,
                                component: Type<T>,
                                options?: {
                                 /** When set will use it as first registry in the DI tree */
                                 registry?: PblNgridRegistryService;
                                 /** When set will destroy the component when the module is destroyed. */
                                 destroy?: boolean;
                                }): ComponentRef<T> {
    let { injector } = ngRef;
    const { registry, destroy } = options || ({} as any);

    if (registry) {
      injector = Injector.create({
        providers: [ { provide: PblNgridRegistryService, useValue: registry.getRoot() } ],
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
