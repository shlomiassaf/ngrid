import { ComponentHarness, ComponentHarnessConstructor, HarnessPredicate } from '@angular/cdk/testing';
import { ColumnCellHarnessFilters, DataCellHarnessFilters, ColumnHeaderCellHarnessFilters, PblNgridDataRowHarnessFilters } from '../ngrid-harness-filters';
import { PblNgridColumnCellHarness, PblNgridDataCellHarness, PblNgridColumnHeaderCellHarness } from '../cell/ngrid-column-cell-harness';

/**
 * Harness for interacting with rows that are structured based on a column
 */
export class PblNgridColumnRowHarness extends ComponentHarness {
  async getCells(filter: ColumnHeaderCellHarnessFilters, type: typeof PblNgridColumnHeaderCellHarness): Promise<PblNgridColumnHeaderCellHarness[]>
  async getCells(filter: DataCellHarnessFilters, type: typeof PblNgridDataCellHarness): Promise<PblNgridDataCellHarness[]>
  async getCells(filter: ColumnCellHarnessFilters): Promise<PblNgridColumnCellHarness[]>;
  async getCells(filter: ColumnCellHarnessFilters = {}, type?: typeof PblNgridColumnCellHarness): Promise<PblNgridColumnCellHarness[]> {
    if (!type) {
      type = PblNgridColumnCellHarness;
    }
    return this.locatorForAll( type.with(filter) )();
  }
}

export class PblNgridColumnHeaderRowHarness extends PblNgridColumnRowHarness {
  // TODO: better detection here, not relay on class that might change.
  static hostSelector = `div[pbl-ngrid-fixed-meta-row-container="header"] pbl-ngrid-column-row.pbl-ngrid-header-row-main`;

  async getCellByColumnId(columnId: string): Promise<PblNgridColumnCellHarness> {
    const result = await this.getCells({ columnIds: [columnId] });
    if (result) {
      return result[0];
    }
  }

  async getCells(filter: ColumnHeaderCellHarnessFilters = {}) {
    return super.getCells(filter, PblNgridColumnCellHarness);
  }
}

export class PblNgridDataRowHarness extends PblNgridColumnRowHarness {
  // TODO: better detection here, not relay on class that might change.
  static hostSelector = `pbl-cdk-table pbl-ngrid-row`;

  /**
   * Gets a `HarnessPredicate` that can be used to search for a nGrid data row with specific attributes.
   * @param options Options for narrowing the search
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with(options: PblNgridDataRowHarnessFilters = {}): HarnessPredicate<PblNgridDataRowHarness> {
    return getDataRowPredicate(PblNgridDataRowHarness, options);
  }

  async getRowIndex(): Promise<number | undefined> {
    const attr = await this.host().then( host => host.getAttribute('row-id') );
    return Number(attr);
  }

  async getRowIdentity(): Promise<string | undefined> {
    return await this.host().then( host => host.getAttribute('row-key') );
  }

  async getCells(filter: DataCellHarnessFilters = {}) {
    return super.getCells(filter, PblNgridDataCellHarness);
  }
}

function getDataRowPredicate<T extends PblNgridDataRowHarness>(type: ComponentHarnessConstructor<T>,
                                                               options: PblNgridDataRowHarnessFilters): HarnessPredicate<T> {
  return new HarnessPredicate(type, options)
    .addOption('rowIndex', options.rowIndex,
        (harness, rowIndex) => harness.getRowIndex().then( result => result === rowIndex))
    .addOption('rowIdentity', options.rowIdentity,
        (harness, rowIdentity) => HarnessPredicate.stringMatches(harness.getRowIdentity(), rowIdentity));
}
