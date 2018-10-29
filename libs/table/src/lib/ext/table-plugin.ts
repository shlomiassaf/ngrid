import { NegTablePluginExtension, NegTablePluginExtensionFactories } from './types';

/** @internal */
export const PLUGIN_STORE = new Map<keyof NegTablePluginExtension, TablePluginMetadata & { target: any }>();

export interface TablePluginMetadata<P extends keyof NegTablePluginExtension = keyof NegTablePluginExtension> {
  id: P;
  factory?: P extends keyof NegTablePluginExtensionFactories
    ? NegTablePluginExtensionFactories[P]
    : never
  ;
}

export function TablePlugin(metadata: TablePluginMetadata) {
  return target => {
    PLUGIN_STORE.set(metadata.id, { ...metadata, target });
  }
}
