import { ComponentFactory, ComponentRef } from '@angular/core';

import { PblColumn } from '../../column/model';
import { PblNgridMetaCellContext } from '../../context/index';
import { PblNgridMultiRegistryMap } from '../types';

export abstract class PblNgridMultiComponentRegistry<T, TKind extends keyof PblNgridMultiRegistryMap> {
  abstract readonly name: string;
  abstract readonly kind: TKind;

  /**
   * When set to true the component will be created with projected content.
   * Setting to true does not ensure projection, the projection is determined by the context creating the component.
   *
   * For example, In the context of `dataHeaderExtensions` the projection will be the content of the cell, other implementations
   * might not include a projection.
   */
  readonly projectContent?: boolean;

  abstract getFactory(context: PblNgridMetaCellContext<any, PblColumn>): ComponentFactory<T>;
  onCreated?(context: PblNgridMetaCellContext<any, PblColumn>, cmpRef: ComponentRef<T>): void;
}
