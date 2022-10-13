import { Type, Injectable, InjectionToken, Inject } from '@angular/core';
import { PblNgridBaseRowComponent } from './base-row.component';
import { GridRowType, PblRowTypeToCellTypeMap } from './types';

export const NGRID_CELL_FACTORY = new InjectionToken<PblNgridCellFactoryResolver>('PblNgridCellFactoryResolver');

export type PblNgridCellFactoryMap = { [P in GridRowType]: Type<PblRowTypeToCellTypeMap<P>>; };

@Injectable()
export class PblNgridCellFactoryResolver<T = any> {
  private readonly factoryMap: PblNgridCellFactoryMap;

  constructor(@Inject(NGRID_CELL_FACTORY) factoryMap: any) {
    this.factoryMap = factoryMap;
  }

  getComponentFactory<TRowType extends GridRowType>(row: PblNgridBaseRowComponent<TRowType, T>): Type<PblRowTypeToCellTypeMap<TRowType>> {
    return this.factoryMap[row.rowType] as any;
  }
}
