import { EmbeddedViewRef } from '@angular/core';
import { PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

interface NoDataViewLogicap {
  (force?: boolean): void;
  viewActive?: boolean;
}

export function noDataViewLogicap(extApi: PblNgridInternalExtensionApi): NoDataViewLogicap {
  let noDateEmbeddedVRef: EmbeddedViewRef<any>;

  const logicap: NoDataViewLogicap = (force?: boolean) => {
    if (noDateEmbeddedVRef) {
      extApi.grid.removeView(noDateEmbeddedVRef, 'beforeContent');
      noDateEmbeddedVRef = undefined;
      logicap.viewActive = false;
    }

    if (force === false) {
      return;
    }


    const noData = extApi.grid.ds && extApi.grid.ds.renderLength === 0;
    if (noData) {
      extApi.grid.addClass('pbl-ngrid-empty');
    } else {
      extApi.grid.removeClass('pbl-ngrid-empty');
    }

    if (noData || force === true) {
      const noDataTemplate = extApi.registry.getSingle('noData');
      if (noDataTemplate) {
        noDateEmbeddedVRef = extApi.grid.createView('beforeContent', noDataTemplate.tRef, { $implicit: extApi.grid }, 0);
        logicap.viewActive = true;
      }
    }
  };

  return logicap;
}
