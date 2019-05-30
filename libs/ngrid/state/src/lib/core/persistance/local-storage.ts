import { PblNgridGlobalState } from '../state-model';
import { PersistAdapter } from '../persist';

export class LocalStoragePersistAdapter implements PersistAdapter {
  private static globalStateKey: string = 'pebulaNgridState';

  save(id: string, state: PblNgridGlobalState): Promise<void> {
    try {
      const globalState: any = localStorage.getItem(LocalStoragePersistAdapter.globalStateKey) || {};
      globalState[id] = JSON.stringify(state);
      localStorage.setItem(LocalStoragePersistAdapter.globalStateKey, globalState);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  load(id: string): Promise<PblNgridGlobalState> {
    const raw = localStorage.getItem(LocalStoragePersistAdapter.globalStateKey);
    const globalState: any = raw ? JSON.parse(raw) : {};
    return Promise.resolve(globalState[id] || {});
  }
}
