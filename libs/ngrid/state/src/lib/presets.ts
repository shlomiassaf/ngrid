import { StateChunkKeyFilter } from './core/models/index';

/**
 * Return's the `User Preferences` preset which focuses on saving and restoring state that the user
 * can define and would want to restore between sessions.
 *
 * For example, saving column width's which the user might have changed using the mouse or any other custom way provided to him (through API).
 * Saving the column order, so if the user re-ordered the table the order can be loaded back again...
 */
export function userSessionPref(...basedOn: StateChunkKeyFilter[]): StateChunkKeyFilter {
  const resultFilter: StateChunkKeyFilter = {
    grid: [
      'showFooter',
      'showHeader',
    ],
    columnVisibility: true,
    columnOrder: true,
    columns: [ 'table' ],
    dataColumn: [
      'width',
    ]
  }

  if (basedOn.length > 0) {
    for (const b of basedOn)
    mergeStateChunkKeyFilter(resultFilter, b);
  }

  return resultFilter;
}


/**
 * Merge a head and tail chunk filters so keys from tail will be merged into head if:
 *
 * - The key does not exist in head
 * - The key exist in head but the value of it is an Array and the value of tail is an Array as well.
 *   In such case, both array's are merged into a single unique array.
 */
function mergeStateChunkKeyFilter(mergeHead: StateChunkKeyFilter, mergeTail: StateChunkKeyFilter) {
  for (const k of Object.keys(mergeTail)) {
    const tailValue = mergeTail[k];
    if (k in mergeHead) {
      const tailHead = mergeHead[k];
      if (Array.isArray(tailHead) && Array.isArray(tailValue)) {
        const s = new Set<string>([...tailHead, ...tailValue]);
        mergeHead[k] = Array.from(s.values());
      }
    } else {
      mergeHead[k] = mergeTail[k];
    }
  }
}
