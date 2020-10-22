import { ComponentFactory, Injectable, InjectionToken, Inject } from '@angular/core';
import { PblNgridBaseRowComponent } from './base-row.component';
import { GridRowType, PblRowTypeToCellTypeMap } from './types';

export const NGRID_CELL_FACTORY = new InjectionToken<PblNgridCellFactoryResolver>('PblNgridCellFactoryResolver');

export type PblNgridCellFactoryMap = { [P in GridRowType]: ComponentFactory<PblRowTypeToCellTypeMap<P>>; };

@Injectable()
export class PblNgridCellFactoryResolver<T = any> {

  constructor(@Inject(NGRID_CELL_FACTORY) private factoryMap: PblNgridCellFactoryMap) { }

  getComponentFactory<TRowType extends GridRowType>(row: PblNgridBaseRowComponent<TRowType, T>): ComponentFactory<PblRowTypeToCellTypeMap<TRowType>> {
    return this.factoryMap[row.rowType] as any;
  }
}
