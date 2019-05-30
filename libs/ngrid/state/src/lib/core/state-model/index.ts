import {
  PblNgridComponent,
  PblMetaColumnDefinition,
  PblColumnGroupDefinition,
  PblColumnDefinition,
  PblMetaRowDefinitions,
  PblColumnSet,
} from '@pebula/ngrid';
import { PickPNP } from './utils';
import * as C from './columns';

export {
  PblNgridMetaColumnState,
  PblNgridGroupColumnState,
  PblNgridColumnState,
  PblNgridMetaRowState,
  PblNgridMetaRowSetState,
  PblNgridColumnDefinitionSetState,
} from './columns';

export interface PblNgridSurfaceState extends
  PickPNP <
    PblNgridComponent,
    'showHeader' | 'showFooter' | 'focusMode' | 'identityProp' | 'usePagination' | 'hideColumns' | 'fallbackMinHeight',
    never
  > { }


export interface PblNgridGlobalState {
  grid: PblNgridSurfaceState;
  columns: C.PblNgridColumnDefinitionSetState
}

export interface StateChunkItem<TState, TValue> {
  state: TState;
  value?: TValue;
}

export interface StateChunks {
  grid: StateChunkItem<PblNgridSurfaceState, PblNgridComponent>,
  metaColumn: StateChunkItem<C.PblNgridMetaColumnState, PblMetaColumnDefinition>;
  metaGroupColumn: StateChunkItem<C.PblNgridGroupColumnState, PblColumnGroupDefinition>;
  dataColumn: StateChunkItem<C.PblNgridColumnState, PblColumnDefinition>;
  metaRow: StateChunkItem<C.PblNgridMetaRowSetState<C.PblNgridMetaColumnState>, PblColumnSet<PblMetaColumnDefinition>>;
  metaGroupRow: StateChunkItem<C.PblNgridMetaRowSetState<C.PblNgridGroupColumnState>, PblColumnSet<PblColumnGroupDefinition>>;
  dataMetaRow: StateChunkItem<C.PblNgridMetaRowState, PblMetaRowDefinitions>;
}
