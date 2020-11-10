import { ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { ColumnCellHarnessFilters, ColumnHeaderCellHarnessFilters, DataCellHarnessFilters } from '../ngrid-harness-filters';
import { findHostClassMatch } from '../utils';

const CLASS_COLUMN_RE = /^cdk-column-(.+)$/;

/**
 * Harness for interacting with cells that belong to a column.
 * This can be a column header cell, data cell or a column footer cell
 */
export class PblNgridColumnCellHarness extends ComponentHarness {
  static hostSelector = `pbl-ngrid-header-cell, pbl-ngrid-cell`;

  static with(options: ColumnCellHarnessFilters = {}): HarnessPredicate<PblNgridColumnCellHarness> {
    return getColumnCellPredicate(PblNgridColumnCellHarness, options);
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async getColumnId(): Promise<string> {
    const match = await findHostClassMatch(await this.host(), CLASS_COLUMN_RE);
    if (match) {
      return match[1];
    }

    throw Error('Could not determine column name of cell.');
  }
}


export class PblNgridColumnHeaderCellHarness extends PblNgridColumnCellHarness {
  // TODO: better detection here, not relay on class that might change.
  static hostSelector = `pbl-ngrid-header-cell`;

  static with(options: ColumnHeaderCellHarnessFilters = {}): HarnessPredicate<PblNgridColumnHeaderCellHarness> {
    return getColumnCellPredicate(PblNgridColumnHeaderCellHarness, options);
  }
}

export class PblNgridDataCellHarness extends PblNgridColumnCellHarness {
  // TODO: better detection here, not relay on class that might change.
  static hostSelector = `pbl-ngrid-cell`;

  static with(options: DataCellHarnessFilters = {}): HarnessPredicate<PblNgridDataCellHarness> {
    return getColumnCellPredicate(PblNgridDataCellHarness, options);
  }
}

export function getColumnCellPredicate<T extends PblNgridColumnCellHarness>(type: ComponentHarnessConstructor<T>,
                                                                            options: ColumnCellHarnessFilters): HarnessPredicate<T> {
  // We can't use FluentApi here because ngc will cry
  const predicate = new HarnessPredicate(type, options);
  predicate.addOption('columnIds', options.columnIds, (harness, columnIds) => harness.getColumnId().then(columnId => columnIds.indexOf(columnId) !== -1));
  return predicate;
}
