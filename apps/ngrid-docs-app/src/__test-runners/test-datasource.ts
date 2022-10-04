import { DynamicClientApi } from '@pebula/apps/docs-app-lib/client-api';
import WindowStoreAdapter from '@pebula/apps/docs-app-lib/client-api/lib/client-adapters/window';

class TestDynamicClientApi extends DynamicClientApi {
  protected createAdapter() {
    this.adapter = new WindowStoreAdapter();
    this.ready = this.adapter.ready;
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
