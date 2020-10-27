import { ComponentFactoryResolver } from '@angular/core';
import {
  PblNgridHeaderCellComponent,
  PblNgridCellComponent,
  PblNgridFooterCellComponent,
  PblNgridMetaCellComponent,
} from './grid/cell';
import { NGRID_CELL_FACTORY, PblNgridCellFactoryMap, PblNgridCellFactoryResolver } from './grid/row/cell-factory.service';

export function ngridCellFactory(cfr: ComponentFactoryResolver): PblNgridCellFactoryMap {
  return {
    'data': cfr.resolveComponentFactory(PblNgridCellComponent),
    'header': cfr.resolveComponentFactory(PblNgridHeaderCellComponent),
    'footer': cfr.resolveComponentFactory(PblNgridFooterCellComponent),
    'meta-header': cfr.resolveComponentFactory(PblNgridMetaCellComponent),
    'meta-footer': cfr.resolveComponentFactory(PblNgridMetaCellComponent),
  }
}

export const PROVIDERS = [
  {
    provide: NGRID_CELL_FACTORY,
    useFactory: ngridCellFactory,
    deps: [ComponentFactoryResolver],
  },
  PblNgridCellFactoryResolver,
]
