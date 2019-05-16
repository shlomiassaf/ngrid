import { EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { ListRange } from '@angular/cdk/collections';

export type StickyDirectionVt = 'top' | 'bottom';
export type StickyDirectionHz = 'left' | 'right';

/**
 * Returns the split range from an aggregated range.
 * An aggregated range describes the range of header, data and footer rows currently in view.
 * This function will split the range into core section, each having it's own range.
 *
 * Note that an aggregated range can span over a single section, all sections or just 2 sections.
 * If a section is not part of the aggregated range it's range is invalid, i.e: ListRange.start >= ListRange.end.
 *
 * @param range The aggregated range
 * @param headerLen The total length of header rows in the table
 * @param dataLen The total length of data rows in the table
 * @returns A tuple containing the ranges [header, data, footer].
 */
export function splitRange(range: ListRange, headerLen: number, dataLen: number): [ListRange, ListRange, ListRange] {
  return [
    { start: range.start, end: headerLen },
    { start: Math.max(0, range.start - headerLen), end: Math.max(0, range.end - headerLen) },
    { start: 0, end: Math.max(0, range.end - (dataLen + headerLen)) },
  ];
}

/**
 * Update sticky positioning values to the rows to match virtual scroll content offset.
 * This function should run after `CdkTable` updated the sticky rows.
 *
 * ## Why
 * `CdkTable` applies sticky positioning to rows by setting top/bottom value to `0px`.
 * Virtual scroll use's a container with an offset to simulate the scrolling.
 *
 * The 2 does not work together, the virtual scroll offset will throw the sticky row out of bound, thus the top/bottom value must be compensated
 * based on the offset.
 */
export function updateStickyRows(offset: number, rows: HTMLElement[], stickyState: boolean[], type: StickyDirectionVt): void {
  const coeff = type === 'top' ? -1 : 1;
  let agg = 0;

  if (coeff === 1) {
    rows = rows.slice().reverse();
  }
  for (let i = 0; i < rows.length; i++) {
    if (stickyState[i]) {
      const row = rows[i];
      row.style[type] = `${coeff * (offset + (coeff * agg))}px`;
      agg += row.getBoundingClientRect().height; // TODO: cache this and update cache actively (size change)
      row.style.display = null;
    }
  }
}

/**
 * Measures the combined size (width for horizontal orientation, height for vertical) of all items
 * in the specified view within the specified range.
 * Throws an error if the range includes items that are not currently rendered.
 *
 * > This is function is identical to `CdkVirtualForOf.measureRangeSize` with minor adjustments
 */
export function measureRangeSize(viewContainer: ViewContainerRef,
                                 range: ListRange,
                                 renderedRange: ListRange,
                                 orientation: 'horizontal' | 'vertical',
                                 stickyState: boolean[] = []): number {
  if (range.start >= range.end) {
    return 0;
  }

  if (range.start < renderedRange.start || range.end > renderedRange.end) {
    throw Error(`Error: attempted to measure an item that isn't rendered.`);
  }

  // The index into the list of rendered views for the first item in the range.
  const renderedStartIndex = range.start - renderedRange.start;
  // The length of the range we're measuring.
  const rangeLen = range.end - range.start;

  // Loop over all root nodes for all items in the range and sum up their size.
  let totalSize = 0;
  let i = rangeLen;
  while (i--) {
    const index = i + renderedStartIndex;
    if (!stickyState[index]) {
      const view = viewContainer.get(index) as EmbeddedViewRef<any> | null;
      let j = view ? view.rootNodes.length : 0;
      while (j--) {
        totalSize += getSize(orientation, view.rootNodes[j]);
      }
    }
  }

  return totalSize;
}

/** Helper to extract size from a DOM Node. */
function getSize(orientation: 'horizontal' | 'vertical', node: Node): number {
  const el = node as Element;
  if (!el.getBoundingClientRect) {
    return 0;
  }
  const rect = el.getBoundingClientRect();
  return orientation == 'horizontal' ? rect.width : rect.height;
}
