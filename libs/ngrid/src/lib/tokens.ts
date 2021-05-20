/**
 * Tokens for symboles that will cause cyclic dependencies.
 */

import { InjectionToken } from '@angular/core';

export type _PblNgridComponent<T = any> = import('./grid/ngrid.component').PblNgridComponent<T>;
export const PBL_NGRID_COMPONENT = new InjectionToken<import('./grid/ngrid.component').PblNgridComponent>('PblNgridComponent');
