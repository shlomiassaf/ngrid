import { PblNgridCellComponent, PblNgridFooterCellComponent, PblNgridHeaderCellComponent, PblNgridMetaCellComponent } from '../cell';

export type GridRowType = 'header' | 'data' | 'footer' | 'meta-header' | 'meta-footer';

export type PblRowTypeToCellTypeMap<T extends GridRowType> =
  T extends 'header' ? PblNgridHeaderCellComponent
    : T extends 'data' ? PblNgridCellComponent
    : T extends 'footer' ? PblNgridFooterCellComponent
    : T extends 'meta-header' ? PblNgridMetaCellComponent
    : T extends 'meta-footer' ? PblNgridMetaCellComponent
    : never;
