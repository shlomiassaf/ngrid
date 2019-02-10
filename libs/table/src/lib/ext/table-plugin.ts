import { PblTablePluginExtension, PblTablePluginExtensionFactories } from './types';

/** @internal */
export const PLUGIN_STORE = new Map<keyof PblTablePluginExtension, TablePluginMetadata & { target: any }>();

export interface TablePluginMetadata<P extends keyof PblTablePluginExtension = keyof PblTablePluginExtension> {
  id: P;
  factory?: P extends keyof PblTablePluginExtensionFactories
    ? PblTablePluginExtensionFactories[P]
    : never
  ;
}

export function TablePlugin(metadata: TablePluginMetadata) {
  return target => {
    PLUGIN_STORE.set(metadata.id, { ...metadata, target });
  }
}
