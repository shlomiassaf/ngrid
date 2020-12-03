import { VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { PblNgridExtensionApi } from '../../../../ext/grid-ext-api';

export interface PblNgridVirtualScrollStrategy extends VirtualScrollStrategy {
  attachExtApi(extApi: PblNgridExtensionApi): void;
}
