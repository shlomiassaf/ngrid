import { DemoDataSource } from '@pebula/apps/shared-data';

class TestDemoDataSource extends DemoDataSource {
  protected createAdapter() {
    const workerConstructor = Worker;
    (global || window).Worker = undefined;
    super.createAdapter();
    (global || window).Worker = workerConstructor;
  }
}
const testDemoDataSource = new TestDemoDataSource();

export async function getDataSourceProvider() {
  await testDemoDataSource.ready;
  return { provide: DemoDataSource, useValue: testDemoDataSource };
}

export function getDataSource() {
  return testDemoDataSource;
}
