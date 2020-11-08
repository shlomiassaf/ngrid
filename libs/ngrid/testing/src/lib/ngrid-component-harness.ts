import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { PblNgridColumnHeaderRowHarness, PblNgridDataRowHarness } from './row/ngrid-column-row-harness';
import { PblNgridHarnessFilters } from './ngrid-harness-filters';

export interface PblNgridHarnessCommands { } // tslint:disable-line: no-empty-interface

export class PblNgridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'pbl-ngrid';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a nGrid with specific attributes.
   * @param options Options for narrowing the search
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with(options: PblNgridHarnessFilters = {}): HarnessPredicate<PblNgridHarness> {
    return new HarnessPredicate(PblNgridHarness, options);
  }

  async getColumnHeaderRow(): Promise<PblNgridColumnHeaderRowHarness> {
    return this.locatorFor(PblNgridColumnHeaderRowHarness)();
  }

  async getDataRow(rowIdentity: string): Promise<PblNgridDataRowHarness | undefined>
  async getDataRow(rowIndex: number): Promise<PblNgridDataRowHarness | undefined>; // tslint:disable-line: unified-signatures
  async getDataRow(rowIdentOrIndex: string | number): Promise<PblNgridDataRowHarness | undefined> {
    if (typeof rowIdentOrIndex === 'number') {
      return this.locatorFor(PblNgridDataRowHarness.with({ rowIndex: rowIdentOrIndex }))();
    } else {
      return this.locatorFor(PblNgridDataRowHarness.with({ rowIdentity: rowIdentOrIndex } ))();
    }
  }

  async getDataRows(): Promise<PblNgridDataRowHarness[]> {
    await this.forceStabilize();
    return this.locatorForAll(PblNgridDataRowHarness)();
  }
}
