import { StateChunkKeyFilter } from './core/models/index';

export function includeDynamicUIState(): StateChunkKeyFilter {
  const x: StateChunkKeyFilter = {
    grid: [
      'hideColumns',
      'showFooter',
      'showHeader',
    ],
    columnOrder: true,
    columns: [ 'table' ],
    dataColumn: [
      'id',
      'prop',
      'width',
    ]
  }
  return x;
}
