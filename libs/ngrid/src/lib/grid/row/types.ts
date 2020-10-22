import { PblNgridCellComponent, PblNgridFooterCellComponent, PblNgridHeaderCellComponent } from '../cell';

export type GridRowType = 'header' | 'data' | 'footer' | 'meta-header' | 'meta-footer';

export type PblRowTypeToCellTypeMap<T extends GridRowType> =
  T extends 'header' ? PblNgridHeaderCellComponent
    : T extends 'data' ? PblNgridCellComponent
    : T extends 'footer' ? PblNgridFooterCellComponent
    : T extends 'meta-header' ? PblNgridHeaderCellComponent
    : T extends 'meta-footer' ? PblNgridFooterCellComponent
    : never;
