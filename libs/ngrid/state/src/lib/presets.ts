import { StateChunkKeyFilter } from './core/state-model';

export function includeDynamicUIState(): StateChunkKeyFilter {
  const x: StateChunkKeyFilter = {
    grid: [
      'hideColumns',
      'showFooter',
      'showHeader',
    ],
    visibleColumnIds: true,
    columns: [ 'table' ],
    dataColumn: [
      'id',
      'prop',
      'width',
    ]
  }
  return x;
}
