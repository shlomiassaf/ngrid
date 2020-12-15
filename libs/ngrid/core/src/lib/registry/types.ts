export interface RegistryChangedEvent {
  op: 'add' | 'remove';
  type: keyof PblNgridMultiRegistryMap | keyof PblNgridSingleRegistryMap;
  value: any;
}

/**
 * A map of valid single-item value that can be registered, and their type.
 */
export interface PblNgridSingleRegistryMap {
  '*': any;
}

/**
 * A map of valid multi-item value that can be registered, and their type (the single type, i.e. T in Array<T>)
 */
export interface PblNgridMultiRegistryMap {
  '*': any;
}
