import {
  PblNgridHeaderCellDefDirective,
  PblNgridCellDefDirective,
  PblNgridEditorCellDefDirective,
  PblNgridFooterCellDefDirective,
} from '../cell/cell-def';

import {
  PblNgridMultiTemplateRegistry,
  PblNgridMultiComponentRegistry,
  PblNgridDataHeaderExtensionContext,
  PblNgridDataHeaderExtensionRef,

  PblNgridNoDataRefDirective,
  PblNgridPaginatorRefDirective,
} from './directives';

export interface RegistryChangedEvent {
  op: 'add' | 'remove';
  type: keyof PblNgridMultiRegistryMap | keyof PblNgridSingleRegistryMap;
  value: any;
}

/**
 * A map of valid single-item value that can be registered, and their type.
 */
export interface PblNgridSingleRegistryMap {
  noData?: PblNgridNoDataRefDirective;
  paginator?: PblNgridPaginatorRefDirective;
}

/**
 * A map of valid multi-item value that can be registered, and their type (the single type, i.e. T in Array<T>)
 */
export interface PblNgridMultiRegistryMap {
  headerCell?: PblNgridHeaderCellDefDirective<any>;
  tableCell?: PblNgridCellDefDirective<any>;
  editorCell?: PblNgridEditorCellDefDirective<any>;
  footerCell?: PblNgridFooterCellDefDirective<any>;
  dataHeaderExtensions?:
    (PblNgridMultiTemplateRegistry<PblNgridDataHeaderExtensionContext, 'dataHeaderExtensions'> & PblNgridDataHeaderExtensionRef)
    | (PblNgridMultiComponentRegistry<any, 'dataHeaderExtensions'> & PblNgridDataHeaderExtensionRef);
}
