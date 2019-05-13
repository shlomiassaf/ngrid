import { PblNgridPluginContext } from '../ext/plugin-control';
import { PblNgridComponent } from './table.component';

declare module '../data-source/data-source' {
  interface PblDataSource<T = any, TData = any> {
    hostGrid: PblNgridComponent<T>
  }
}

export function bindToDataSource(plugin: PblNgridPluginContext): void {
  plugin.events.subscribe( event => {
    if (event.kind === 'onDataSource') {
      const { curr, prev } = event;
      if (prev && prev.hostGrid === plugin.table) {
        prev.hostGrid = undefined;
      }
      if (curr) {
        curr.hostGrid = plugin.table;
      }
    } else if (event.kind === 'onDestroy') {
      const ds = plugin.table.ds;
      if (ds.hostGrid === plugin.table) {
        ds.hostGrid = undefined;
      }
    }
  });
}
