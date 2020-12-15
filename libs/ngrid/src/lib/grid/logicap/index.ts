import { PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';
import { noDataViewLogicap } from './no-data-view';
import { bindRegistryLogicap } from './bind-registry';
import { paginationViewLogicap } from './pagination-view';

export interface Logicaps {
  bindRegistry: ReturnType<typeof bindRegistryLogicap>;
  noData: ReturnType<typeof noDataViewLogicap>;
  pagination: ReturnType<typeof paginationViewLogicap>;
}

export function logicap(extApi: PblNgridInternalExtensionApi): Logicaps {
  return {
    bindRegistry: bindRegistryLogicap(extApi),
    noData: noDataViewLogicap(extApi),
    pagination: paginationViewLogicap(extApi),
  };
}
