import { Type } from '@angular/core';
import { PblNgridPluginExtension, PblNgridPluginExtensionFactories } from './types';

/** @internal */
export const PLUGIN_STORE = new Map<keyof PblNgridPluginExtension, NgridPluginMetadata & { target: any }>();

export interface NgridPluginMetadata<P extends keyof PblNgridPluginExtension = keyof PblNgridPluginExtension> {
  id: P;
  factory?: P extends keyof PblNgridPluginExtensionFactories
    ? PblNgridPluginExtensionFactories[P]
    : never
  ;
  runOnce?: () => void;
}

export function ngridPlugin(metadata: NgridPluginMetadata, target: Type<any>) {
  if (metadata.runOnce) {
    metadata.runOnce();
  }
  PLUGIN_STORE.set(metadata.id, { ...metadata, target });
  return metadata.id;
}
