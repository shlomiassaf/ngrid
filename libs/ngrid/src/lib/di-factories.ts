import { ComponentFactoryResolver } from '@angular/core';
import {
  PblNgridHeaderCellComponent,
  PblNgridCellComponent,
  PblNgridFooterCellComponent,
} from './grid/cell';
import { NGRID_CELL_FACTORY, PblNgridCellFactoryMap, PblNgridCellFactoryResolver } from './grid/row/cell-factory.service';

export function ngridCellFactory(cfr: ComponentFactoryResolver): PblNgridCellFactoryMap {
  return {
    'data': cfr.resolveComponentFactory(PblNgridCellComponent),
    'header': cfr.resolveComponentFactory(PblNgridHeaderCellComponent),
    'footer': cfr.resolveComponentFactory(PblNgridFooterCellComponent),
    'meta-header': cfr.resolveComponentFactory(PblNgridHeaderCellComponent),
    'meta-footer': cfr.resolveComponentFactory(PblNgridFooterCellComponent),
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
