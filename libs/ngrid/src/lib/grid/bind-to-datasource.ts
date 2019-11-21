import { PblNgridPluginContext } from '../ext/plugin-control';
import { PblNgridComponent } from './ngrid.component';

declare module '../data-source/data-source' {
  interface PblDataSource<T = any, TData = any> {
    hostGrid: PblNgridComponent<T>
  }
}

export function bindToDataSource(plugin: PblNgridPluginContext): void {
  plugin.events.subscribe( event => {
    if (event.kind === 'onDataSource') {
      const { curr, prev } = event;
      if (prev && prev.hostGrid === plugin.grid) {
        prev.hostGrid = undefined;
      }
      if (curr) {
        curr.hostGrid = plugin.grid;
      }
    } else if (event.kind === 'onDestroy') {
      const ds = plugin.grid.ds;
      if (ds.hostGrid === plugin.grid) {
        ds.hostGrid = undefined;
      }
    }
  });
}
