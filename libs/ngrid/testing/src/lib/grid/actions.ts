import { UnitTestElement } from '@angular/cdk/testing/testbed';
import { PblNgridHarness } from './ngrid-component-harness';

declare module './ngrid-component-harness' {
  interface PblNgridHarness {
    /**
     * Takes an immediate snapshot of the current rows rendered in the view and their order. (only stores the row identity, no cell data)
     * and then poll the view to detect when the row have been re-rendered.
     *
     * You can provide a function that will run right after the snapshot, allowing changes to be executed right after the snapshot.
     * The function must return a promise and the promise value will be returned by this method.
     *
     * Optimizing render change detection:
     * Detecting a change in the row rendering state is simple, first a snapshot of current row identities is saves (A collection of strings)
     * and then, for a predefined period of time (timeout) it is sampled against the view at predefined intervals (frequency)
     * You can optimize the process by changing the frequency and/or timeout.
     * A longer timeout means more time to test but allowing more time for render heavy operations
     * A bigger frequency means sampling more often, allowing change to pop faster
     *
     * For example, a timeout of 500 (half second) and frequency of 10 means the view is samples every 50ms, 10 times.
     *
     * > This mimics the `onRenderChanged` event of the `DataSource`.
     *
     * @param fn A function that will return a promise for an operation that might cause a render change
     * @param timeoutMs The total time (in ms) to wait before giving up (default: 500)
     * @param frequency The total number of iterations to sample within the timeout (default: 10)
     */
    waitForRenderChanged<T = undefined>(fn?: () => Promise<T>, timeoutMs?: number, frequency?: number): Promise<T>;


    scrollToEnd(): Promise<void>;
    getColumnIds(): Promise<string[]>;
    getViewPortData(): Promise<string[][]>;
  }
}

class PblNgridHarnessActions extends PblNgridHarness {

  async waitForRenderChanged<T = undefined>(fn?: () => Promise<T>, timeoutMs = 500, frequency = 10): Promise<T> {
    const rowIdentities = await this.getDataRows().then(rows => rows.map(r => r.getRowIdentity())).then( rows => Promise.all(rows) );

    const result: T = typeof fn === 'function' ? await fn() : undefined;

    frequency = Math.max(frequency, 1);
    timeoutMs = Math.max(timeoutMs, 0);
    const interval = Math.floor(timeoutMs / frequency);

    const wait = () => new Promise( res => { setTimeout(res, interval)});

    while (frequency > 0) {
      await wait();

      const newRows = await this.getDataRows();
      if (rowIdentities.length !== newRows.length) {
        return;
      }

      for (let i = 0; i < rowIdentities.length; i++) {
        const newIdentity = newRows[i] ? (await newRows[i].getRowIdentity()) : null;
        if (newIdentity !== rowIdentities[i]) {
          return;
        }
      }

      frequency -= 1;
    }

    return result;
  }

  async getColumnIds() {
    return this.getColumnHeaderRow()
      .then( header => header.getCells() )
      .then( columns => Promise.all(columns.map( c => c.getColumnId() )) );
  }

  async getViewPortData() {
    await this.forceStabilize();
    return this.getDataRows()
      .then( rows => rows.map( r => r.getCells().then( cells => cells.map(c => c.getText() )) ) )
      .then( rows => Promise.all(rows.map( pRow => pRow.then( row => Promise.all(row) ))));
  }

  async scrollToEnd(waitForChange = true) {
    const viewPort = await this.locatorFor('pbl-cdk-virtual-scroll-viewport')();
    // TODO: support protractor env
    const element = (viewPort as UnitTestElement).element;
    element.scroll(0, element.scrollHeight);
  }
}

const keys = Object.getOwnPropertyNames(PblNgridHarnessActions.prototype) as Array<keyof PblNgridHarnessActions>;
for (const key of keys) {
  PblNgridHarness.register(key, PblNgridHarnessActions.prototype[key])
}
