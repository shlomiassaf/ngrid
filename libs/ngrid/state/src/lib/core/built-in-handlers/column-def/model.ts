import {
  PblMetaColumnDefinition,
  PblColumnGroupDefinition,
  PblColumnDefinition,
  PblMetaRowDefinitions,
  PblColumnSet,
  PblNgridColumnDefinitionSet,
 } from '@pebula/ngrid';

 import { PickPNP } from '../../utils';

export interface PblNgridBaseColumnState extends
  PickPNP <
    import('@pebula/ngrid/lib/grid/columns/types').PblBaseColumnDefinition,
    'id' | 'label' | 'css' | 'type' | 'width' | 'minWidth' | 'maxWidth',
    never
  > { }

export interface PblNgridMetaColumnState extends PblNgridBaseColumnState,
  PickPNP <
    PblMetaColumnDefinition,
    never,
    'kind' | 'rowIndex'
  > {
  id: PblNgridBaseColumnState['id'];
}

export interface PblNgridGroupColumnState extends PblNgridBaseColumnState,
  PickPNP <
    PblColumnGroupDefinition,
    never,
    'prop' | 'rowIndex' | 'span'
  > { }

export interface PblNgridColumnState extends PblNgridBaseColumnState,
  PickPNP <
    PblColumnDefinition,
    'headerType' | 'footerType' | 'sort' | 'sortAlias' | 'editable' | 'pin',
    'prop'
  > { }

export interface PblNgridMetaRowState extends
  PickPNP <
    PblMetaRowDefinitions,
    'rowClassName' | 'type',
    never
  > { }

export interface PblNgridMetaRowSetState<T extends PblNgridMetaColumnState | PblNgridGroupColumnState> extends PblNgridMetaRowState,
  PickPNP <
    PblColumnSet<T extends PblNgridMetaColumnState ? PblMetaColumnDefinition : PblColumnGroupDefinition>,
    never,
    'rowIndex'
  > {
  cols: T[];
}

export type ColRowDefsToState<T> = T extends PblMetaRowDefinitions ? PblNgridMetaRowState
  : T extends PblColumnDefinition[] ? PblNgridColumnState[]
  : T extends PblColumnSet<PblMetaColumnDefinition>[] ? PblNgridMetaRowSetState<PblNgridMetaColumnState>[]
  : T extends PblColumnSet<PblColumnGroupDefinition>[] ? PblNgridMetaRowSetState<PblNgridGroupColumnState>[]
  : never;

export type BaseColumnDefinitionSetState<T = PblNgridColumnDefinitionSet> = {
  [P in keyof T]: T[P] extends PblNgridColumnDefinitionSet['table']
    ? BaseColumnDefinitionSetState<T[P]>
    : ColRowDefsToState<T[P]>
  ;
}

export interface PblNgridColumnDefinitionSetState extends PickPNP<BaseColumnDefinitionSetState, 'header' | 'footer' | 'headerGroup', 'table'> { }
