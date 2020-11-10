import { DemoDataSource } from '@pebula/apps/shared-data';

const demoDataSource = new DemoDataSource(true);

export async function getDataSourceProvider() {
  await demoDataSource.ready;
  return { provide: DemoDataSource, useValue: demoDataSource };
}

export function getDataSource() {
  return demoDataSource;
}
