import { PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

/**
 * Listens to registry changes and update the grid
 * Must run when the grid in at content init
 */
export function bindRegistryLogicap(extApi: PblNgridInternalExtensionApi) {
  return () => {
    // no need to unsubscribe, the reg service is per grid instance and it will destroy when this grid destroy.
    // Also, at this point initial changes from templates provided in the content are already inside so they will not trigger
    // the order here is very important, because component top of this grid will fire life cycle hooks AFTER this component
    // so if we have a top level component registering a template on top it will not show unless we listen.
    extApi.registry.changes
      .subscribe( changes => {
        let gridCell = false;
        let headerFooterCell = false;
        for (const c of changes) {
          switch (c.type) {
            case 'tableCell':
              gridCell = true;
              break;
            case 'headerCell':
            case 'footerCell':
              headerFooterCell = true;
              break;
            case 'noData':
              extApi.logicaps.noData();
              break;
            case 'paginator':
              extApi.logicaps.pagination();
              break;
          }
        }
        if (gridCell) {
          extApi.columnStore.attachCustomCellTemplates();
        }
        if (headerFooterCell) {
          extApi.columnStore.attachCustomHeaderCellTemplates();
        }
      });
  }
}
