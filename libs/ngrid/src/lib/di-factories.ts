import {
  PblNgridHeaderCellComponent,
  PblNgridCellComponent,
  PblNgridFooterCellComponent,
  PblNgridMetaCellComponent,
} from './grid/cell';
import { NGRID_CELL_FACTORY, PblNgridCellFactoryMap, PblNgridCellFactoryResolver } from './grid/row/cell-factory.service';

export function ngridCellFactory(): PblNgridCellFactoryMap {
  return {
    'data': PblNgridCellComponent,
    'header': PblNgridHeaderCellComponent,
    'footer': PblNgridFooterCellComponent,
    'meta-header': PblNgridMetaCellComponent,
    'meta-footer': PblNgridMetaCellComponent,
  }
}

export const PROVIDERS = [
  {
    provide: NGRID_CELL_FACTORY,
    useFactory: ngridCellFactory,
  },
  PblNgridCellFactoryResolver,
]
