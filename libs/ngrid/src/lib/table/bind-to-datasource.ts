import { PblNgridPluginContext } from '../ext/plugin-control';
import { PblNgridComponent } from './table.component';

declare module '../data-source/data-source' {
  interface PblDataSource<T = any, TData = any> {
    hostTable: PblNgridComponent<T>
  }
}

export function bindToDataSource(plugin: PblNgridPluginContext): void {
  plugin.events.subscribe( event => {
    if (event.kind === 'onDataSource') {
      const { curr, prev } = event;
      if (prev && prev.hostTable === plugin.table) {
        prev.hostTable = undefined;
      }
      if (curr) {
        curr.hostTable = plugin.table;
      }
    } else if (event.kind === 'onDestroy') {
      const ds = plugin.table.ds;
      if (ds.hostTable === plugin.table) {
        ds.hostTable = undefined;
      }
    }
  });
}
