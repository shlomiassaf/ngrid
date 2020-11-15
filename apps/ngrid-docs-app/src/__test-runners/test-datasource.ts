import { DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';

class TestDynamicClientApi extends DynamicClientApi {
  protected createAdapter() {
    const workerConstructor = Worker;
    (global || window).Worker = undefined;
    super.createAdapter();
    (global || window).Worker = workerConstructor;
  }
}
const testDynamicClientApi = new TestDynamicClientApi();

export async function getDataSourceProvider() {
  await testDynamicClientApi.ready;
  return { provide: DynamicClientApi, useValue: testDynamicClientApi };
}

export function getDataSource() {
  return testDynamicClientApi;
}
