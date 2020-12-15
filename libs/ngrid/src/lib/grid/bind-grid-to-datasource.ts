import { PblNgridInternalExtensionApi } from '../ext/grid-ext-api';
import { PblNgridComponent } from './ngrid.component';

declare module '@pebula/ngrid/core/lib/data-source/data-source' {
  interface PblDataSource<T = any, TData = any> {
    hostGrid: PblNgridComponent<T>;
  }
}

export function bindGridToDataSource(extApi: PblNgridInternalExtensionApi): void {
  extApi.events.subscribe( event => {
    if (event.kind === 'onDataSource') {
      const { curr, prev } = event;
      if (prev && prev.hostGrid === extApi.grid) {
        prev.hostGrid = undefined;
      }
      if (curr) {
        curr.hostGrid = extApi.grid;
      }
    } else if (event.kind === 'onDestroy') {
      const ds = extApi.grid.ds;
      if (ds.hostGrid === extApi.grid) {
        ds.hostGrid = undefined;
      }
    }
  });
}
