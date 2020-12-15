import { EmbeddedViewRef, ViewContainerRef } from '@angular/core';
import { ListRange } from '@angular/cdk/collections';
import { PblNgridConfigService } from '@pebula/ngrid/core';
import { PblNgridVirtualScrollStrategy } from './strategies/types';

export type StickyDirectionVt = 'top' | 'bottom';
export type StickyDirectionHz = 'left' | 'right';

export function resolveScrollStrategy(config: PblNgridConfigService,
                                      scrollStrategy: PblNgridVirtualScrollStrategy,
                                      fallback: () => PblNgridVirtualScrollStrategy): PblNgridVirtualScrollStrategy {
  if (!scrollStrategy && config.has('virtualScroll')) {
    const virtualScrollConfig = config.get('virtualScroll');
    if (typeof virtualScrollConfig.defaultStrategy === 'function') {
      scrollStrategy = virtualScrollConfig.defaultStrategy();
    }
  }
  return scrollStrategy || fallback();
}

/**
 * Returns the split range from an aggregated range.
 * An aggregated range describes the range of header, data and footer rows currently in view.
 * This function will split the range into core section, each having it's own range.
 *
 * Note that an aggregated range can span over a single section, all sections or just 2 sections.
 * If a section is not part of the aggregated range it's range is invalid, i.e: ListRange.start >= ListRange.end.
 *
 * @param range The aggregated range
 * @param headerLen The total length of header rows in the grid
 * @param dataLen The total length of data rows in the grid
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
  for (const i in rows) {
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

  // Loop over all the views, find the first and land node and compute the size by subtracting
  // the top of the first node from the bottom of the last one.
  let firstNode: HTMLElement | undefined;
  let lastNode: HTMLElement | undefined;

  // Find the first node by starting from the beginning and going forwards.
  for (let i = 0; i < rangeLen; i++) {
    const view = viewContainer.get(i + renderedStartIndex) as EmbeddedViewRef<any> | null;
    if (view && view.rootNodes.length) {
      firstNode = lastNode = view.rootNodes[0];
      break;
    }
  }

  // Find the last node by starting from the end and going backwards.
  for (let i = rangeLen - 1; i > -1; i--) {
    const view = viewContainer.get(i + renderedStartIndex) as EmbeddedViewRef<any> | null;
    if (view && view.rootNodes.length) {
      lastNode = view.rootNodes[view.rootNodes.length - 1];
      break;
    }
  }

  return firstNode && lastNode ? getOffset('end', lastNode) - getOffset('start', firstNode) : 0;
}

/** Helper to extract the offset of a DOM Node in a certain direction. */
function getOffset(direction: 'start' | 'end', node: Node) {
  const el = node as Element;
  if (!el.getBoundingClientRect) {
    return 0;
  }
  const rect = el.getBoundingClientRect();

  return direction === 'start' ? rect.top : rect.bottom;
}

export function calculateBrowserPxLimit() {
  try {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '9999999999999999px';
    document.body.appendChild(div);

    const size = Math.abs(div.getBoundingClientRect().top) * 0.85;
    document.body.removeChild(div);
    // We return 85% of the limit, rounded down to the closes million.
    // E.G: if the limit is 33,554,428 then 85% is 28,521,263.8 which is rounded down to 28,000,000
    return size - (size % 1000000)
  } catch (err) {
    // TODO: Either return null, or return a value based on the browser implementation which we might get as a param.
    return 10000000;
  }
}
