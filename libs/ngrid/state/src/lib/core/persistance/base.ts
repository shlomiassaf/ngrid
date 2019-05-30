import { PblNgridGlobalState } from '../state-model';

export interface PersistAdapter {
  save(id: string, state: PblNgridGlobalState): Promise<void>;
  load(id: string): Promise<PblNgridGlobalState>;
}
