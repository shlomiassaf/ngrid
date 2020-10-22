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
  ComponentFactoryResolver,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule as ScrollingModuleExp } from '@angular/cdk-experimental/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';

import {
  PEB_NGRID_CONFIG, PblNgridConfig,
  PblNgridRegistryService,
  PblCdkTableComponent,
  PblNgridComponent,

  PblNgridRowComponent, PblNgridHeaderRowComponent,
  PblNgridMetaRowContainerComponent, PblMetaRowDirective,
  PblNgridColumnDef,
  PblNgridHeaderCellDefDirective,
  PblNgridFooterCellDefDirective,
  PblNgridCellDefDirective, PblNgridEditorCellDefDirective,
  PblNgridHeaderCellComponent,
  PblNgridCellComponent,
  PblNgridFooterCellComponent,

  PblNgridCellStyling,
  PblNgridOuterSectionDirective,
  PblNgridHeaderExtensionRefDirective,
  PblNgridNoDataRefDirective,
  PblNgridPaginatorRefDirective,

  PblNgridHideColumns,
  PblColumnSizeObserver,
  PblCdkVirtualScrollViewportComponent, PblCdkVirtualScrollDirective, PblNgridScrolling,

  PblNgridCellEditAutoFocusDirective,

  PblNgridConfigService,
} from './grid/index';
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
    PblNgridRowComponent, PblNgridHeaderRowComponent,
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

    PblNgridHideColumns,
    PblColumnSizeObserver,
    PblCdkVirtualScrollViewportComponent, PblCdkVirtualScrollDirective, PblNgridScrolling,

    PblNgridCellEditAutoFocusDirective,

    PblNgridComponent,
  ],
  providers: [
    ...PROVIDERS,
  ],
  exports: [
    PblNgridRowComponent, PblNgridHeaderRowComponent,
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

    PblNgridHideColumns,
    PblColumnSizeObserver,
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
