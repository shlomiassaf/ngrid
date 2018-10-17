import { SgTablePluginExtension, SgTablePluginExtensionFactories } from './types';

/** @internal */
export const PLUGIN_STORE = new Map<keyof SgTablePluginExtension, TablePluginMetadata & { target: any }>();

export interface TablePluginMetadata<P extends keyof SgTablePluginExtension = keyof SgTablePluginExtension> {
  id: P;
  factory?: P extends keyof SgTablePluginExtensionFactories
    ? SgTablePluginExtensionFactories[P]
    : never
  ;
}

export function TablePlugin(metadata: TablePluginMetadata) {
  return target => {
    PLUGIN_STORE.set(metadata.id, { ...metadata, target });
  }
}
