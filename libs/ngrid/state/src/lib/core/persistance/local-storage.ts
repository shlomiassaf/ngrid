import { PblNgridGlobalState, PersistAdapter } from '../state-model';

export class PblNgridLocalStoragePersistAdapter implements PersistAdapter {
  private static globalStateKey: string = 'pebulaNgridState';

  save(id: string, state: PblNgridGlobalState): Promise<void> {
    try {
      const store = this.loadGlobalStateStore();
      store[id] = state;
      if (!state.__metadata__) {
        state.__metadata__ = {} as any;
      }
      state.__metadata__.updatedAt = new Date().toISOString();

      this.saveGlobalStateStore(store);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  load(id: string): Promise<PblNgridGlobalState> {
    return Promise.resolve(this.loadGlobalStateStore()[id] || {} as any);
  }

  exists(id: string): Promise<boolean> {
    return Promise.resolve(!!this.loadGlobalStateStore()[id]);
  }

  private loadGlobalStateStore(): { [id: string]: PblNgridGlobalState } {
    const raw = localStorage.getItem(PblNgridLocalStoragePersistAdapter.globalStateKey);
    return raw ? JSON.parse(raw) : {};
  }

  private saveGlobalStateStore(store: { [id: string]: PblNgridGlobalState }): void {
    localStorage.setItem(PblNgridLocalStoragePersistAdapter.globalStateKey, JSON.stringify(store));
  }
}
