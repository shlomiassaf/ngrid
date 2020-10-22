import { PblMetaRowDefinitions } from '../column/model';
import { PblMetaRow } from '../meta-rows/meta-row.directive';
import { PblNgridMetaRowService } from '../meta-rows/meta-row.service';

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
