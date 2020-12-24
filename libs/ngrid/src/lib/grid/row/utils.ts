import { PblMetaRowDefinitions } from '@pebula/ngrid/core';
import { PblNgridMetaRowService, PblMetaRow } from '../meta-rows/meta-row.service';

export function initColumnOrMetaRow(element: HTMLElement, isFooter: boolean) {
  element.classList.add(...(isFooter ? ['cdk-footer-row', 'pbl-ngrid-footer-row'] : ['cdk-header-row', 'pbl-ngrid-header-row']));
}

export function setRowVisibility(element: HTMLElement, visible: boolean) {
  if (visible) {
    element.classList.remove('pbl-ngrid-row-hidden');
  } else {
    element.classList.add('pbl-ngrid-row-hidden');
  }
}

export function applyMetaRowClass(metaRowsService: PblNgridMetaRowService,
                                  metaRows: PblMetaRow,
                                  element: HTMLElement,
                                  oldMetaRow: PblMetaRowDefinitions,
                                  newMetaRow: PblMetaRowDefinitions) {
  if (oldMetaRow) {
    if (oldMetaRow.rowClassName) {
      element.classList.remove(oldMetaRow.rowClassName);
    }
    metaRowsService.removeMetaRow(metaRows);
  }
  metaRows.meta = newMetaRow;
  if (newMetaRow) {
    if (newMetaRow.rowClassName) {
      element.classList.add(newMetaRow.rowClassName);
    }
    metaRowsService.addMetaRow(metaRows);
  }
}

const FIRST_LAST_ROW_SELECTORS = {
  header: {
    selector: 'pbl-ngrid-header-row',
    first: 'pbl-ngrid-first-header-row',
    last: 'pbl-ngrid-last-header-row',
  },
  footer: {
    selector: 'pbl-ngrid-footer-row',
    first: 'pbl-ngrid-first-footer-row',
    last: 'pbl-ngrid-last-footer-row',
  }
};

export function updateMetaRowFirstLastClass(section: keyof typeof FIRST_LAST_ROW_SELECTORS,
                                            root: Element,
                                            prev: { first?: Element; last?: Element }): { first?: Element; last?: Element } {
  const sectionCss = FIRST_LAST_ROW_SELECTORS[section];
  const rows = root.querySelectorAll(`.${sectionCss.selector}:not(.pbl-ngrid-row-visually-hidden):not(.pbl-ngrid-row-hidden)`);

  const first = rows[0];
  if (prev.first !== first) {
    prev.first?.classList.remove(sectionCss.first);
    first?.classList.add(sectionCss.first);
  }
  const last = rows[rows.length - 1];
  if (prev.last !== last) {
    prev.last?.classList.remove(sectionCss.last);
    last?.classList.add(sectionCss.last);
  }
  return { first, last };
}
